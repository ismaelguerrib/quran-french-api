import { In } from 'typeorm';
import { AyahTranslationEntity } from '../../ayah-translations/entities/ayah-translation.entity';
import { AyahEntity } from '../../ayahs/entities/ayah.entity';
import { TranslationSourceEntity } from '../../translation-sources/entities/translation-source.entity';
import AppDataSource from '../data-source';

const FATIHA_SURAH_NUMBER = 1;
const FATIHA_AYAH_NUMBERS = [1, 2, 3, 4, 5, 6, 7] as const;

const TRANSLATION_SOURCES: Array<
  Pick<
    TranslationSourceEntity,
    'code' | 'label' | 'language' | 'chronologicalOrder'
  >
> = [
  {
    code: 'hamidullah-fr',
    label: 'Muhammad Hamidullah',
    language: 'fr',
    chronologicalOrder: 9,
  },
  {
    code: 'masson-fr',
    label: 'Denise Masson',
    language: 'fr',
    chronologicalOrder: 18,
  },
];

const FATIHA_TEST_TRANSLATIONS: Record<string, Record<number, string>> = {
  'hamidullah-fr': {
    1: "[Test] Al-Fatiha 1:1 - Au nom d'Allah, le Tout Misericordieux, le Tres Misericordieux.",
    2: '[Test] Al-Fatiha 1:2 - Louange a Allah, Seigneur des mondes.',
    3: '[Test] Al-Fatiha 1:3 - Le Tout Misericordieux, le Tres Misericordieux.',
    4: '[Test] Al-Fatiha 1:4 - Maitre du Jour de la retribution.',
    5: "[Test] Al-Fatiha 1:5 - C'est Toi que nous adorons, et c'est Toi dont nous implorons secours.",
    6: '[Test] Al-Fatiha 1:6 - Guide-nous dans le droit chemin.',
    7: '[Test] Al-Fatiha 1:7 - Le chemin de ceux que Tu as combles de faveurs.',
  },
  'masson-fr': {
    1: '[Test] Al-Fatiha 1:1 - Au nom de Dieu, le Clement, le Misericordieux.',
    2: "[Test] Al-Fatiha 1:2 - Louange a Dieu, Seigneur de l'univers.",
    3: '[Test] Al-Fatiha 1:3 - Le Clement, le Misericordieux.',
    4: '[Test] Al-Fatiha 1:4 - Roi du Jour du Jugement.',
    5: "[Test] Al-Fatiha 1:5 - C'est Toi que nous adorons, c'est Toi dont nous implorons le secours.",
    6: '[Test] Al-Fatiha 1:6 - Dirige-nous dans la voie droite.',
    7: '[Test] Al-Fatiha 1:7 - La voie de ceux que Tu as combles de bienfaits.',
  },
};

async function seedFatiha(): Promise<void> {
  await AppDataSource.initialize();

  try {
    await AppDataSource.transaction(async (manager) => {
      const sourceRepository = manager.getRepository(TranslationSourceEntity);
      const ayahRepository = manager.getRepository(AyahEntity);
      const ayahTranslationRepository = manager.getRepository(
        AyahTranslationEntity,
      );

      await sourceRepository.upsert(TRANSLATION_SOURCES, ['code']);

      const sources = await sourceRepository.find({
        where: { code: In(TRANSLATION_SOURCES.map((source) => source.code)) },
      });
      const sourcesByCode = new Map(
        sources.map((source) => [source.code, source]),
      );

      await ayahRepository.upsert(
        FATIHA_AYAH_NUMBERS.map((ayahNumber) => ({
          surahNumber: FATIHA_SURAH_NUMBER,
          verseKey: String(ayahNumber),
          verseNumber: ayahNumber,
        })),
        ['surahNumber', 'verseKey'],
      );

      const ayahs = await ayahRepository.find({
        where: {
          surahNumber: FATIHA_SURAH_NUMBER,
          verseKey: In(FATIHA_AYAH_NUMBERS.map(String)),
        },
      });
      const ayahsByNumber = new Map(
        ayahs.map((ayah) => [ayah.verseNumber, ayah]),
      );

      const translationsToUpsert = TRANSLATION_SOURCES.flatMap((source) => {
        const persistedSource = sourcesByCode.get(source.code);
        if (!persistedSource) {
          throw new Error(
            `Missing translation source in database: ${source.code}`,
          );
        }

        return FATIHA_AYAH_NUMBERS.map((ayahNumber) => {
          const ayah = ayahsByNumber.get(ayahNumber);
          if (!ayah) {
            throw new Error(`Missing ayah in database: 1:${ayahNumber}`);
          }

          const text = FATIHA_TEST_TRANSLATIONS[source.code]?.[ayahNumber];
          if (!text) {
            throw new Error(
              `Missing seed translation text for source=${source.code} ayah=1:${ayahNumber}`,
            );
          }

          return {
            ayahId: ayah.id,
            translationSourceId: persistedSource.id,
            reference: `${FATIHA_SURAH_NUMBER}${source.code}${ayahNumber}`,
            text,
            wordCount: text.split(/\s+/).length,
          };
        });
      });

      await ayahTranslationRepository.upsert(translationsToUpsert, [
        'ayahId',
        'translationSourceId',
      ]);

      console.log(
        `Fatiha seed complete: ${FATIHA_AYAH_NUMBERS.length} ayahs, ${TRANSLATION_SOURCES.length} sources, ${translationsToUpsert.length} translations.`,
      );
    });
  } finally {
    await AppDataSource.destroy();
  }
}

void seedFatiha().catch((error: unknown) => {
  console.error('Fatiha seeding failed.');
  console.error(error);
  process.exit(1);
});
