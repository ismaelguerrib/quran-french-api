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

  it('throws when the verse key does not exist', async () => {
    ayahRepository.findOne.mockResolvedValue(null);

    await expect(service.getAyah(72, '1+C11156')).rejects.toThrow(
      'Verse 72:1+C11156 was not found.',
    );
  });
});
