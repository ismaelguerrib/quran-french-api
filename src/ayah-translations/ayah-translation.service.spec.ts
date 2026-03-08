import { Test, TestingModule } from '@nestjs/testing';
import { AyahTranslationService } from './ayah-translation.service';

describe('AyahTranslationService', () => {
  let service: AyahTranslationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AyahTranslationService],
    }).compile();

    service = module.get<AyahTranslationService>(AyahTranslationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
