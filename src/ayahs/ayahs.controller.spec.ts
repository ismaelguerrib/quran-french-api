import { Test, TestingModule } from '@nestjs/testing';
import { AyahController } from './ayahs.controller';
import { AyahService } from './ayahs.service';

describe('AyahController', () => {
  let controller: AyahController;
  const ayahService = {
    getAyah: jest.fn(),
    getAyahBySurahIdentifier: jest.fn(),
    listAyahsBySurahIdentifier: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AyahController],
      providers: [
        {
          provide: AyahService,
          useValue: ayahService,
        },
      ],
    }).compile();

    controller = module.get<AyahController>(AyahController);
    jest.clearAllMocks();
  });

  it('delegates numeric verse lookups to the service', async () => {
    ayahService.getAyah.mockResolvedValue({
      surahNumber: 2,
      verseKey: '255',
      verseNumber: 255,
      translations: [],
    });

    await controller.getAyah(2, '255', { source: ['hamidullah-fr'] });

    expect(ayahService.getAyah).toHaveBeenCalledWith(2, '255', [
      'hamidullah-fr',
    ]);
  });

  it('delegates surah-name verse lookups to the service', async () => {
    ayahService.getAyahBySurahIdentifier.mockResolvedValue({
      surahNumber: 2,
      verseKey: '255',
      verseNumber: 255,
      translations: [],
    });

    await controller.getAyahBySurahIdentifier('al-baqara', '255', {
      source: ['hamidullah-fr', 'masson-fr'],
    });

    expect(ayahService.getAyahBySurahIdentifier).toHaveBeenCalledWith(
      'al-baqara',
      '255',
      ['hamidullah-fr', 'masson-fr'],
    );
  });

  it('delegates surah verse listings to the service', async () => {
    ayahService.listAyahsBySurahIdentifier.mockResolvedValue({
      data: [],
      meta: {
        surahNumber: 1,
        surahName: 'al-fatiha',
        total: 7,
      },
    });

    await controller.listAyahsBySurah('al-fatiha', {
      source: ['hamidullah-fr'],
    });

    expect(ayahService.listAyahsBySurahIdentifier).toHaveBeenCalledWith(
      'al-fatiha',
      ['hamidullah-fr'],
    );
  });
});
