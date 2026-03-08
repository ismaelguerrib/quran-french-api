import { Test, TestingModule } from '@nestjs/testing';
import { TranslationSourceController } from './translation-source.controller';
import { TranslationSourceService } from './translation-source.service';

describe('TranslationSourceController', () => {
  let controller: TranslationSourceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TranslationSourceController],
      providers: [TranslationSourceService],
    }).compile();

    controller = module.get<TranslationSourceController>(TranslationSourceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
