import { createReadStream } from 'node:fs';
import { join } from 'node:path';
import readline from 'node:readline';
import { type Repository } from 'typeorm';
import { type QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { AyahTranslationEntity } from '../../ayah-translations/entities/ayah-translation.entity';
import { AyahEntity } from '../../ayahs/entities/ayah.entity';
import { TranslationSourceEntity } from '../../translation-sources/entities/translation-source.entity';
import AppDataSource from '../data-source';

const DATASET_FILE_PATH = join(
  __dirname,
  '..',
  'quran-french-multi-translation-data.csv',
);

const EXPECTED_HEADERS = [
  'Ref',
  'Sourate',
  'Verset',
  'Traducteur',
  'Traduction',
  'Ordre chrono',
  'Nbr mots',
] as const;

interface QuranDatasetRow {
  reference: string;
  surahNumber: number;
  verseKey: string;
  translatorName: string;
  translationText: string | null;
  chronologicalOrder: number;
  wordCount: number | null;
}

interface TranslationSourceSeedRecord {
  code: string;
  label: string;
  language: string;
  chronologicalOrder: number;
}

interface AyahSeedRecord {
  surahNumber: number;
  verseKey: string;
  verseNumber: number | null;
}

interface PendingTranslationSeedRecord {
  ayahCompositeKey: string;
  sourceCode: string;
  reference: string;
  text: string | null;
  wordCount: number | null;
}

function parseSemicolonSeparatedLine(line: string): string[] {
  const cells: string[] = [];
  let currentCell = '';
  let insideQuotedValue = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      const nextCharacter = line[index + 1];
      if (insideQuotedValue && nextCharacter === '"') {
        currentCell += '"';
        index += 1;
      } else {
        insideQuotedValue = !insideQuotedValue;
      }
      continue;
    }

    if (character === ';' && !insideQuotedValue) {
      cells.push(currentCell);
      currentCell = '';
      continue;
    }

    currentCell += character;
  }

  cells.push(currentCell);
  return cells.map((cell, index) =>
    index === 0 ? cell.replace(/^\uFEFF/, '') : cell,
  );
}

function parseRequiredIntegerField(
  value: string,
  fieldName: string,
  minimumValue = 0,
): number {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < minimumValue) {
    throw new Error(
      `${fieldName} must be an integer greater than or equal to ${minimumValue}.`,
    );
  }

  return parsedValue;
}

function parseOptionalIntegerField(value: string): number | null {
  if (value.trim().length === 0) {
    return null;
  }

  const parsedValue = Number(value);
  if (!Number.isInteger(parsedValue) || parsedValue < 0) {
    throw new Error('Optional numeric field must be an integer >= 0.');
  }

  return parsedValue;
}

function inferLanguage(translatorName: string): string {
  if (translatorName === 'a- arabe') {
    return 'ar';
  }

  if (translatorName === 'a- Translittération') {
    return 'ar-Latn';
  }

  return 'fr';
}

function createTranslationSourceCode(
  translatorName: string,
  language: string,
): string {
  const normalizedName = translatorName
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const normalizedLanguage = language
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `${normalizedName}-${normalizedLanguage}`;
}

function createAyahCompositeKey(surahNumber: number, verseKey: string): string {
  return `${surahNumber}:${verseKey}`;
}

function parseVerseNumber(verseKey: string): number | null {
  return /^\d+$/.test(verseKey) ? Number(verseKey) : null;
}

async function loadDatasetRows(): Promise<QuranDatasetRow[]> {
  const fileStream = createReadStream(DATASET_FILE_PATH, { encoding: 'utf-8' });
  const lineReader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const datasetRows: QuranDatasetRow[] = [];
  let lineNumber = 0;
  let headers: string[] | null = null;

  for await (const rawLine of lineReader) {
    lineNumber += 1;

    if (rawLine.trim().length === 0) {
      continue;
    }

    const columns = parseSemicolonSeparatedLine(rawLine);

    if (!headers) {
      headers = columns;
      if (
        headers.length !== EXPECTED_HEADERS.length ||
        !EXPECTED_HEADERS.every((header, index) => headers?.[index] === header)
      ) {
        throw new Error(
          `Unexpected dataset headers at line 1. Received: ${headers.join(', ')}`,
        );
      }
      continue;
    }

    if (columns.length !== headers.length) {
      throw new Error(
        `Malformed dataset row at line ${lineNumber}. Expected ${headers.length} columns and received ${columns.length}.`,
      );
    }

    const record = Object.fromEntries(
      headers.map((header, index) => [header, columns[index]]),
    ) as Record<(typeof EXPECTED_HEADERS)[number], string>;

    const verseKey = record.Verset.trim();
    const translatorName = record.Traducteur.trim();
    const reference = record.Ref.trim();

    if (!verseKey || !translatorName || !reference) {
      throw new Error(`Missing required dataset value at line ${lineNumber}.`);
    }

    datasetRows.push({
      reference,
      surahNumber: parseRequiredIntegerField(
        record.Sourate,
        `Sourate at line ${lineNumber}`,
        1,
      ),
      verseKey,
      translatorName,
      translationText:
        record.Traduction.trim().length > 0 ? record.Traduction : null,
      chronologicalOrder: parseRequiredIntegerField(
        record['Ordre chrono'],
        `Ordre chrono at line ${lineNumber}`,
      ),
      wordCount: parseOptionalIntegerField(record['Nbr mots']),
    });
  }

  return datasetRows;
}

async function insertInBatches<T extends object>(
  repository: Repository<T>,
  records: QueryDeepPartialEntity<T>[],
  batchSize: number,
): Promise<void> {
  for (let offset = 0; offset < records.length; offset += batchSize) {
    const batch = records.slice(offset, offset + batchSize);
    await repository.insert(batch);
  }
}

async function importDataset(): Promise<void> {
  const datasetRows = await loadDatasetRows();

  const translationSourcesByCode = new Map<
    string,
    TranslationSourceSeedRecord
  >();
  const ayahsByCompositeKey = new Map<string, AyahSeedRecord>();
  const pendingTranslations: PendingTranslationSeedRecord[] = [];

  for (const datasetRow of datasetRows) {
    const language = inferLanguage(datasetRow.translatorName);
    const sourceCode = createTranslationSourceCode(
      datasetRow.translatorName,
      language,
    );

    const existingSource = translationSourcesByCode.get(sourceCode);
    if (existingSource) {
      if (
        existingSource.label !== datasetRow.translatorName ||
        existingSource.chronologicalOrder !== datasetRow.chronologicalOrder ||
        existingSource.language !== language
      ) {
        throw new Error(
          `Inconsistent source metadata detected for ${datasetRow.translatorName}.`,
        );
      }
    } else {
      translationSourcesByCode.set(sourceCode, {
        code: sourceCode,
        label: datasetRow.translatorName,
        language,
        chronologicalOrder: datasetRow.chronologicalOrder,
      });
    }

    const ayahCompositeKey = createAyahCompositeKey(
      datasetRow.surahNumber,
      datasetRow.verseKey,
    );

    if (!ayahsByCompositeKey.has(ayahCompositeKey)) {
      ayahsByCompositeKey.set(ayahCompositeKey, {
        surahNumber: datasetRow.surahNumber,
        verseKey: datasetRow.verseKey,
        verseNumber: parseVerseNumber(datasetRow.verseKey),
      });
    }

    pendingTranslations.push({
      ayahCompositeKey,
      sourceCode,
      reference: datasetRow.reference,
      text: datasetRow.translationText,
      wordCount: datasetRow.wordCount,
    });
  }

  await AppDataSource.initialize();

  try {
    await AppDataSource.transaction(async (entityManager) => {
      const ayahTranslationRepository = entityManager.getRepository(
        AyahTranslationEntity,
      );
      const ayahRepository = entityManager.getRepository(AyahEntity);
      const translationSourceRepository = entityManager.getRepository(
        TranslationSourceEntity,
      );

      await ayahTranslationRepository.clear();
      await ayahRepository.clear();
      await translationSourceRepository.clear();

      const translationSourceRecords = Array.from(
        translationSourcesByCode.values(),
      ).sort((leftSource, rightSource) => {
        if (leftSource.chronologicalOrder !== rightSource.chronologicalOrder) {
          return leftSource.chronologicalOrder - rightSource.chronologicalOrder;
        }

        return leftSource.code.localeCompare(rightSource.code);
      });

      await insertInBatches(
        translationSourceRepository,
        translationSourceRecords,
        250,
      );

      const ayahRecords = Array.from(ayahsByCompositeKey.values()).sort(
        (leftAyah, rightAyah) => {
          if (leftAyah.surahNumber !== rightAyah.surahNumber) {
            return leftAyah.surahNumber - rightAyah.surahNumber;
          }

          if (
            leftAyah.verseNumber !== null &&
            rightAyah.verseNumber !== null &&
            leftAyah.verseNumber !== rightAyah.verseNumber
          ) {
            return leftAyah.verseNumber - rightAyah.verseNumber;
          }

          return leftAyah.verseKey.localeCompare(rightAyah.verseKey);
        },
      );

      await insertInBatches(ayahRepository, ayahRecords, 1000);

      const persistedSources = await translationSourceRepository.find();
      const persistedSourceIdsByCode = new Map(
        persistedSources.map((translationSource) => [
          translationSource.code,
          translationSource.id,
        ]),
      );

      const persistedAyahs = await ayahRepository.find();
      const persistedAyahIdsByCompositeKey = new Map(
        persistedAyahs.map((ayah) => [
          createAyahCompositeKey(ayah.surahNumber, ayah.verseKey),
          ayah.id,
        ]),
      );

      const translationRecords = pendingTranslations.map(
        (pendingTranslation) => {
          const ayahId = persistedAyahIdsByCompositeKey.get(
            pendingTranslation.ayahCompositeKey,
          );
          const translationSourceId = persistedSourceIdsByCode.get(
            pendingTranslation.sourceCode,
          );

          if (!ayahId || !translationSourceId) {
            throw new Error(
              `Unable to resolve translation dependencies for ${pendingTranslation.reference}.`,
            );
          }

          return {
            ayahId,
            translationSourceId,
            reference: pendingTranslation.reference,
            text: pendingTranslation.text,
            wordCount: pendingTranslation.wordCount,
          };
        },
      );

      await insertInBatches(
        ayahTranslationRepository,
        translationRecords,
        5000,
      );

      console.log(
        `Dataset import complete: ${ayahRecords.length} verse keys, ${translationSourceRecords.length} sources, ${translationRecords.length} translations.`,
      );
    });
  } finally {
    await AppDataSource.destroy();
  }
}

void importDataset().catch((error: unknown) => {
  console.error('Quran dataset import failed.');
  console.error(error);
  process.exit(1);
});
