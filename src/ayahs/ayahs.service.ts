import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AyahTranslationEntity } from '../ayah-translations/entities/ayah-translation.entity';
import { resolveSurahDefinition } from '../surahs/surah-definitions';
import { TranslationSourceEntity } from '../translation-sources/entities/translation-source.entity';
import { AyahListResponseDto } from './dto/ayah-list-response.dto';
import { AyahResponseDto } from './dto/ayah-response.dto';
import { AyahEntity } from './entities/ayah.entity';

interface LoadedSourcesResult {
  orderedSourceCodes: string[];
  sourceIds: number[];
  sourcesByCode: Map<string, TranslationSourceEntity>;
}

@Injectable()
export class AyahService {
  constructor(
    @InjectRepository(AyahEntity)
    private readonly ayahRepository: Repository<AyahEntity>,
    @InjectRepository(TranslationSourceEntity)
    private readonly translationSourceRepository: Repository<TranslationSourceEntity>,
    @InjectRepository(AyahTranslationEntity)
    private readonly ayahTranslationRepository: Repository<AyahTranslationEntity>,
  ) {}

  async getAyahBySurahIdentifier(
    surahIdentifier: string,
    verseKey: string,
    requestedSourceCodes?: string[],
  ): Promise<AyahResponseDto> {
    const surahDefinition = this.getRequiredSurahDefinition(surahIdentifier);

    return this.getAyah(
      surahDefinition.surahNumber,
      verseKey,
      requestedSourceCodes,
    );
  }

  async getAyah(
    surahNumber: number,
    verseKey: string,
    requestedSourceCodes?: string[],
  ): Promise<AyahResponseDto> {
    const ayah = await this.ayahRepository.findOne({
      where: { surahNumber, verseKey },
    });

    if (!ayah) {
      throw new NotFoundException(
        `Verse ${surahNumber}:${verseKey} was not found.`,
      );
    }

    const { orderedSourceCodes, sourceIds, sourcesByCode } =
      await this.loadSources(requestedSourceCodes);

    const translations =
      sourceIds.length > 0
        ? await this.ayahTranslationRepository.find({
            where: {
              ayahId: ayah.id,
              translationSourceId: In(sourceIds),
            },
          })
        : [];

    const translationBySourceId = new Map<number, AyahTranslationEntity>(
      translations.map((translation) => [
        translation.translationSourceId,
        translation,
      ]),
    );

    return this.toAyahResponse(
      ayah,
      orderedSourceCodes,
      sourcesByCode,
      translationBySourceId,
    );
  }

  async listAyahsBySurahIdentifier(
    surahIdentifier: string,
    requestedSourceCodes?: string[],
  ): Promise<AyahListResponseDto> {
    const surahDefinition = this.getRequiredSurahDefinition(surahIdentifier);
    const ayahs = await this.ayahRepository.find({
      where: { surahNumber: surahDefinition.surahNumber },
    });

    if (ayahs.length === 0) {
      throw new NotFoundException(
        `Surah ${surahDefinition.surahNumber} was not found.`,
      );
    }

    ayahs.sort((leftAyah, rightAyah) => {
      if (
        leftAyah.verseNumber !== null &&
        rightAyah.verseNumber !== null &&
        leftAyah.verseNumber !== rightAyah.verseNumber
      ) {
        return leftAyah.verseNumber - rightAyah.verseNumber;
      }

      return leftAyah.verseKey.localeCompare(rightAyah.verseKey);
    });

    const { orderedSourceCodes, sourceIds, sourcesByCode } =
      await this.loadSources(requestedSourceCodes);

    const ayahIds = ayahs.map((ayah) => ayah.id);
    const translations =
      ayahIds.length > 0 && sourceIds.length > 0
        ? await this.ayahTranslationRepository.find({
            where: {
              ayahId: In(ayahIds),
              translationSourceId: In(sourceIds),
            },
          })
        : [];

    const translationsByAyahId = new Map<
      number,
      Map<number, AyahTranslationEntity>
    >();

    for (const translation of translations) {
      const translationBySourceId =
        translationsByAyahId.get(translation.ayahId) ??
        new Map<number, AyahTranslationEntity>();

      translationBySourceId.set(translation.translationSourceId, translation);
      translationsByAyahId.set(translation.ayahId, translationBySourceId);
    }

    return {
      data: ayahs.map((ayah) =>
        this.toAyahResponse(
          ayah,
          orderedSourceCodes,
          sourcesByCode,
          translationsByAyahId.get(ayah.id) ??
            new Map<number, AyahTranslationEntity>(),
        ),
      ),
      meta: {
        surahNumber: surahDefinition.surahNumber,
        surahName: surahDefinition.canonicalName,
        total: ayahs.length,
      },
    };
  }

  private getRequiredSurahDefinition(surahIdentifier: string) {
    const surahDefinition = resolveSurahDefinition(surahIdentifier);

    if (!surahDefinition) {
      throw new NotFoundException(`Surah "${surahIdentifier}" was not found.`);
    }

    return surahDefinition;
  }

  private async loadSources(
    requestedSourceCodes?: string[],
  ): Promise<LoadedSourcesResult> {
    const sources = requestedSourceCodes
      ? await this.translationSourceRepository.find({
          where: { code: In(requestedSourceCodes) },
        })
      : await this.translationSourceRepository.find({
          order: {
            chronologicalOrder: 'ASC',
            code: 'ASC',
          },
        });

    return {
      orderedSourceCodes:
        requestedSourceCodes && requestedSourceCodes.length > 0
          ? requestedSourceCodes
          : sources.map((source) => source.code),
      sourceIds: sources.map((source) => source.id),
      sourcesByCode: new Map(sources.map((source) => [source.code, source])),
    };
  }

  private toAyahResponse(
    ayah: AyahEntity,
    orderedSourceCodes: string[],
    sourcesByCode: Map<string, TranslationSourceEntity>,
    translationBySourceId: Map<number, AyahTranslationEntity>,
  ): AyahResponseDto {
    return {
      surahNumber: ayah.surahNumber,
      verseKey: ayah.verseKey,
      verseNumber: ayah.verseNumber,
      translations: orderedSourceCodes.map((sourceCode) => {
        const source = sourcesByCode.get(sourceCode);
        const translation = source
          ? translationBySourceId.get(source.id)
          : undefined;

        return {
          source: sourceCode,
          author: source?.label ?? null,
          text: translation?.text ?? null,
          wordCount: translation?.wordCount ?? null,
        };
      }),
    };
  }
}
