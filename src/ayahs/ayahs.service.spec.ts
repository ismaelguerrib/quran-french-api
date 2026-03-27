import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AyahTranslationEntity } from '../ayah-translations/entities/ayah-translation.entity';
import { TranslationSourceEntity } from '../translation-sources/entities/translation-source.entity';
import { AyahEntity } from './entities/ayah.entity';
import { AyahService } from './ayahs.service';

describe('AyahService', () => {
  let service: AyahService;
  const ayahRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
  };
  const translationSourceRepository = {
    find: jest.fn(),
  };
  const ayahTranslationRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AyahService,
        {
          provide: getRepositoryToken(AyahEntity),
          useValue: ayahRepository,
        },
        {
          provide: getRepositoryToken(TranslationSourceEntity),
          useValue: translationSourceRepository,
        },
        {
          provide: getRepositoryToken(AyahTranslationEntity),
          useValue: ayahTranslationRepository,
        },
      ],
    }).compile();

    service = module.get<AyahService>(AyahService);
    jest.clearAllMocks();
  });

  it('returns all sources when no explicit source filter is provided', async () => {
    ayahRepository.findOne.mockResolvedValue({
      id: 7,
      surahNumber: 2,
      verseKey: '255',
      verseNumber: 255,
    });
    translationSourceRepository.find.mockResolvedValue([
      { id: 1, code: 'hamidullah-fr', label: 'Hamidullah' },
      { id: 2, code: 'masson-fr', label: 'Masson' },
    ]);
    ayahTranslationRepository.find.mockResolvedValue([
      {
        translationSourceId: 1,
        text: 'Texte Hamidullah',
        wordCount: 2,
      },
      {
        translationSourceId: 2,
        text: 'Texte Masson',
        wordCount: 2,
      },
    ]);

    await expect(service.getAyah(2, '255')).resolves.toEqual({
      surahNumber: 2,
      verseKey: '255',
      verseNumber: 255,
      translations: [
        {
          source: 'hamidullah-fr',
          author: 'Hamidullah',
          text: 'Texte Hamidullah',
          wordCount: 2,
        },
        {
          source: 'masson-fr',
          author: 'Masson',
          text: 'Texte Masson',
          wordCount: 2,
        },
      ],
    });
  });

  it('resolves a normalized surah name before loading one verse', async () => {
    ayahRepository.findOne.mockResolvedValue({
      id: 8,
      surahNumber: 2,
      verseKey: '255',
      verseNumber: 255,
    });
    translationSourceRepository.find.mockResolvedValue([
      { id: 1, code: 'hamidullah-fr', label: 'Hamidullah' },
    ]);
    ayahTranslationRepository.find.mockResolvedValue([
      {
        translationSourceId: 1,
        text: 'Texte Hamidullah',
        wordCount: 2,
      },
    ]);

    await expect(
      service.getAyahBySurahIdentifier('al-baqara', '255', ['hamidullah-fr']),
    ).resolves.toEqual({
      surahNumber: 2,
      verseKey: '255',
      verseNumber: 255,
      translations: [
        {
          source: 'hamidullah-fr',
          author: 'Hamidullah',
          text: 'Texte Hamidullah',
          wordCount: 2,
        },
      ],
    });

    expect(ayahRepository.findOne).toHaveBeenCalledWith({
      where: { surahNumber: 2, verseKey: '255' },
    });
  });

  it('lists a surah in dataset order and keeps requested source order', async () => {
    ayahRepository.find.mockResolvedValue([
      { id: 11, surahNumber: 1, verseKey: '1', verseNumber: 1 },
      { id: 9, surahNumber: 1, verseKey: '0', verseNumber: 0 },
      { id: 10, surahNumber: 1, verseKey: '0,5', verseNumber: null },
    ]);
    translationSourceRepository.find.mockResolvedValue([
      { id: 2, code: 'masson-fr', label: 'Masson' },
      { id: 1, code: 'hamidullah-fr', label: 'Hamidullah' },
    ]);
    ayahTranslationRepository.find.mockResolvedValue([
      {
        ayahId: 9,
        translationSourceId: 1,
        text: 'Al-Fatiha',
        wordCount: 1,
      },
      {
        ayahId: 10,
        translationSourceId: 1,
        text: 'Bismillah',
        wordCount: 1,
      },
      {
        ayahId: 11,
        translationSourceId: 1,
        text: 'Louange a Allah',
        wordCount: 3,
      },
      {
        ayahId: 11,
        translationSourceId: 2,
        text: 'Gloire a Dieu',
        wordCount: 3,
      },
    ]);

    await expect(
      service.listAyahsBySurahIdentifier('al-fatiha', [
        'masson-fr',
        'hamidullah-fr',
      ]),
    ).resolves.toEqual({
      data: [
        {
          surahNumber: 1,
          verseKey: '0',
          verseNumber: 0,
          translations: [
            {
              source: 'masson-fr',
              author: 'Masson',
              text: null,
              wordCount: null,
            },
            {
              source: 'hamidullah-fr',
              author: 'Hamidullah',
              text: 'Al-Fatiha',
              wordCount: 1,
            },
          ],
        },
        {
          surahNumber: 1,
          verseKey: '0,5',
          verseNumber: null,
          translations: [
            {
              source: 'masson-fr',
              author: 'Masson',
              text: null,
              wordCount: null,
            },
            {
              source: 'hamidullah-fr',
              author: 'Hamidullah',
              text: 'Bismillah',
              wordCount: 1,
            },
          ],
        },
        {
          surahNumber: 1,
          verseKey: '1',
          verseNumber: 1,
          translations: [
            {
              source: 'masson-fr',
              author: 'Masson',
              text: 'Gloire a Dieu',
              wordCount: 3,
            },
            {
              source: 'hamidullah-fr',
              author: 'Hamidullah',
              text: 'Louange a Allah',
              wordCount: 3,
            },
          ],
        },
      ],
      meta: {
        surahNumber: 1,
        surahName: 'al-fatiha',
        total: 3,
      },
    });
  });

  it('throws when the verse key does not exist', async () => {
    ayahRepository.findOne.mockResolvedValue(null);

    await expect(service.getAyah(72, '1+C11156')).rejects.toThrow(
      'Verse 72:1+C11156 was not found.',
    );
  });

  it('throws when the surah name is unknown', async () => {
    await expect(
      service.listAyahsBySurahIdentifier('unknown-surah'),
    ).rejects.toThrow('Surah "unknown-surah" was not found.');
  });
});
