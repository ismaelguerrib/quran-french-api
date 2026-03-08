import { Test, TestingModule } from '@nestjs/testing';
import { TranslationSourceService } from './translation-source.service';

describe('TranslationSourceService', () => {
  let service: TranslationSourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TranslationSourceService],
    }).compile();

    service = module.get<TranslationSourceService>(TranslationSourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
