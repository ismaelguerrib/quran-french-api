import { Test, TestingModule } from '@nestjs/testing';
import { TranslationSourceController } from './translation-source.controller';
import { TranslationSourceService } from './translation-source.service';

describe('TranslationSourceController', () => {
  let controller: TranslationSourceController;
  const translationSourceService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TranslationSourceController],
      providers: [
        {
          provide: TranslationSourceService,
          useValue: translationSourceService,
        },
      ],
    }).compile();

    controller = module.get<TranslationSourceController>(
      TranslationSourceController,
    );
    jest.clearAllMocks();
  });

  it('delegates list queries to the service', async () => {
    translationSourceService.findAll.mockResolvedValue({
      data: [],
      meta: { page: 1, pageSize: 20, total: 0 },
    });

    await controller.findAll({
      page: 1,
      pageSize: 20,
      sortBy: 'chronologicalOrder',
      sortDir: 'asc',
    });

    expect(translationSourceService.findAll).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20,
      sortBy: 'chronologicalOrder',
      sortDir: 'asc',
    });
  });

  it('delegates detail lookups to the service', async () => {
    translationSourceService.findOne.mockResolvedValue({
      data: {
        id: 1,
        code: 'hamidullah-fr',
        label: 'Hamidullah',
        language: 'fr',
        chronologicalOrder: 9,
      },
    });

    await controller.findOne({ id: 1 });

    expect(translationSourceService.findOne).toHaveBeenCalledWith(1);
  });
});
