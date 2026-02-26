import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should return status ok', () => {
      expect(appController.health()).toEqual({ status: 'ok' });
    });
  });

  describe('openApi', () => {
    it('should expose an OpenAPI document header', () => {
      const spec = appController.openApi();
      expect(spec.openapi).toBe('3.0.3');
      expect(spec.info.title).toBe('Quran French API');
      expect(spec.paths['/verses/{surahNumber}/{ayahNumber}']).toBeDefined();
    });
  });
});
