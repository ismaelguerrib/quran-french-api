import { Test, TestingModule } from '@nestjs/testing';
import { AyahTranslationController } from './ayah-translation.controller';
import { AyahTranslationService } from './ayah-translation.service';

describe('AyahTranslationController', () => {
  let controller: AyahTranslationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AyahTranslationController],
      providers: [AyahTranslationService],
    }).compile();

    controller = module.get<AyahTranslationController>(AyahTranslationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
