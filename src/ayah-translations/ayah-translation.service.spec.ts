import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AyahTranslationEntity } from './entities/ayah-translation.entity';
import { AyahTranslationService } from './ayah-translation.service';

describe('AyahTranslationService', () => {
  let service: AyahTranslationService;
  const queryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };
  const ayahTranslationRepository = {
    createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AyahTranslationService,
        {
          provide: getRepositoryToken(AyahTranslationEntity),
          useValue: ayahTranslationRepository,
        },
      ],
    }).compile();

    service = module.get<AyahTranslationService>(AyahTranslationService);
    jest.clearAllMocks();
  });

  it('maps paginated translation payloads', async () => {
    queryBuilder.getManyAndCount.mockResolvedValue([
      [
        {
          id: 1,
          ayahId: 10,
          translationSourceId: 3,
          ayah: {
            surahNumber: 2,
            verseKey: '255',
            verseNumber: 255,
          },
          translationSource: {
            code: 'hamidullah-fr',
            label: 'Hamidullah',
          },
          reference: '2hamidullah-fr255',
          text: 'Allah! Point de divinité à part Lui.',
          wordCount: 7,
        },
      ],
      1,
    ]);

    await expect(
      service.findAll({
        page: 1,
        pageSize: 20,
        surahNumber: 2,
        ayahNumber: '255',
        source: 'hamidullah-fr',
      }),
    ).resolves.toEqual({
      data: [
        {
          id: 1,
          ayahId: 10,
          translationSourceId: 3,
          surahNumber: 2,
          verseKey: '255',
          verseNumber: 255,
          source: 'hamidullah-fr',
          author: 'Hamidullah',
          reference: '2hamidullah-fr255',
          text: 'Allah! Point de divinité à part Lui.',
          wordCount: 7,
        },
      ],
      meta: {
        page: 1,
        pageSize: 20,
        total: 1,
      },
    });

    expect(ayahTranslationRepository.createQueryBuilder).toHaveBeenCalledWith(
      'ayahTranslation',
    );
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      'ayah.surahNumber = :surahNumber',
      { surahNumber: 2 },
    );
  });

  it('throws when the translation row does not exist', async () => {
    ayahTranslationRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne(99)).rejects.toThrow(
      'Ayah translation with id 99 was not found.',
    );
  });
});
