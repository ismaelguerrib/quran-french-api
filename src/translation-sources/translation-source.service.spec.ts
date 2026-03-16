import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { TranslationSourceEntity } from './entities/translation-source.entity';
import { TranslationSourceService } from './translation-source.service';

describe('TranslationSourceService', () => {
  let service: TranslationSourceService;
  const queryBuilder = {
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };
  const translationSourceRepository = {
    createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TranslationSourceService,
        {
          provide: getRepositoryToken(TranslationSourceEntity),
          useValue: translationSourceRepository,
        },
      ],
    }).compile();

    service = module.get<TranslationSourceService>(TranslationSourceService);
    jest.clearAllMocks();
  });

  it('returns paginated payloads with chronology metadata', async () => {
    queryBuilder.getManyAndCount.mockResolvedValue([
      [
        {
          id: 1,
          code: 'hamidullah-fr',
          label: 'Hamidullah',
          language: 'fr',
          chronologicalOrder: 9,
        },
      ],
      1,
    ]);

    await expect(
      service.findAll({
        page: 1,
        pageSize: 20,
        sortBy: 'chronologicalOrder',
        sortDir: 'asc',
        language: 'fr',
      }),
    ).resolves.toEqual({
      data: [
        {
          id: 1,
          code: 'hamidullah-fr',
          label: 'Hamidullah',
          language: 'fr',
          chronologicalOrder: 9,
        },
      ],
      meta: {
        page: 1,
        pageSize: 20,
        total: 1,
      },
    });

    expect(translationSourceRepository.createQueryBuilder).toHaveBeenCalled();
    expect(queryBuilder.where).toHaveBeenCalledWith(
      'translationSource.language = :language',
      { language: 'fr' },
    );
  });

  it('throws when the translation source does not exist', async () => {
    translationSourceRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne(42)).rejects.toThrow(
      'Translation source with id 42 was not found.',
    );
  });
});
