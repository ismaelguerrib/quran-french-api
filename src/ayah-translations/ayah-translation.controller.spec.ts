import { Test, TestingModule } from '@nestjs/testing';
import { AyahTranslationController } from './ayah-translation.controller';
import { AyahTranslationService } from './ayah-translation.service';

describe('AyahTranslationController', () => {
  let controller: AyahTranslationController;
  const ayahTranslationService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AyahTranslationController],
      providers: [
        {
          provide: AyahTranslationService,
          useValue: ayahTranslationService,
        },
      ],
    }).compile();

    controller = module.get<AyahTranslationController>(
      AyahTranslationController,
    );
    jest.clearAllMocks();
  });

  it('delegates list queries to the service', async () => {
    ayahTranslationService.findAll.mockResolvedValue({
      data: [],
      meta: { page: 1, pageSize: 20, total: 0 },
    });

    await controller.findAll({
      page: 1,
      pageSize: 20,
      surahNumber: 72,
      ayahNumber: '1',
      source: 'hamidullah-fr',
    });

    expect(ayahTranslationService.findAll).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20,
      surahNumber: 72,
      ayahNumber: '1',
      source: 'hamidullah-fr',
    });
  });

  it('delegates detail lookups to the service', async () => {
    ayahTranslationService.findOne.mockResolvedValue({
      data: {
        id: 1,
        ayahId: 1,
        translationSourceId: 1,
        surahNumber: 1,
        verseKey: '1',
        verseNumber: 1,
        source: 'hamidullah-fr',
        author: 'Hamidullah',
        reference: '1hamidullah-fr1',
        text: 'Test translation',
        wordCount: 2,
      },
    });

    await controller.findOne(1);

    expect(ayahTranslationService.findOne).toHaveBeenCalledWith(1);
  });
});
