import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { configureApplication } from '../src/app.bootstrap';
import { AppController } from '../src/app.controller';
import { AyahTranslationController } from '../src/ayah-translations/ayah-translation.controller';
import { AyahTranslationService } from '../src/ayah-translations/ayah-translation.service';
import { AyahController } from '../src/ayahs/ayahs.controller';
import { AyahService } from '../src/ayahs/ayahs.service';
import { TranslationSourceController } from '../src/translation-sources/translation-source.controller';
import { TranslationSourceService } from '../src/translation-sources/translation-source.service';

describe('Quran French API (e2e)', () => {
  let app: INestApplication<App>;
  const ayahService = {
    getAyah: jest.fn().mockResolvedValue({
      surahNumber: 1,
      verseKey: '1',
      verseNumber: 1,
      translations: [],
    }),
  };
  const translationSourceService = {
    findAll: jest.fn().mockResolvedValue({
      data: [],
      meta: { page: 1, pageSize: 20, total: 0 },
    }),
    findOne: jest.fn().mockResolvedValue({
      data: {
        id: 1,
        code: 'hamidullah-fr',
        label: 'Hamidullah',
        language: 'fr',
        chronologicalOrder: 9,
      },
    }),
  };
  const ayahTranslationService = {
    findAll: jest.fn().mockResolvedValue({
      data: [],
      meta: { page: 1, pageSize: 20, total: 0 },
    }),
    findOne: jest.fn().mockResolvedValue({
      data: {
        id: 1,
        ayahId: 1,
        translationSourceId: 1,
        reference: '1hamidullah-fr1',
        text: 'Test translation',
        wordCount: 2,
      },
    }),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [
        AppController,
        AyahController,
        AyahTranslationController,
        TranslationSourceController,
      ],
      providers: [
        {
          provide: AyahService,
          useValue: ayahService,
        },
        {
          provide: AyahTranslationService,
          useValue: ayahTranslationService,
        },
        {
          provide: TranslationSourceService,
          useValue: translationSourceService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApplication(app);
    await app.init();
    jest.clearAllMocks();
  });

  it('/v1/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/v1/health')
      .expect(200)
      .expect({ status: 'ok' });
  });

  it('/v1/docs (GET)', () => {
    return request(app.getHttpServer())
      .get('/v1/docs')
      .expect(200)
      .expect((response) => {
        expect(response.text).toContain('swagger-ui');
      });
  });

  it('/v1/openapi.json (GET)', () => {
    return request(app.getHttpServer())
      .get('/v1/openapi.json')
      .expect(200)
      .expect((res) => {
        const body = res.body as {
          openapi: string;
          paths: Record<string, unknown>;
        };

        expect(body.openapi).toBe('3.0.0');
        expect(body.paths['/v1/health'] ?? body.paths['/health']).toBeDefined();
        expect(
          body.paths['/v1/ayahs/{surahNumber}/{ayahNumber}'] ??
            body.paths['/ayahs/{surahNumber}/{ayahNumber}'],
        ).toBeDefined();
        expect(
          body.paths['/v1/translation-sources'] ??
            body.paths['/translation-sources'] ??
            body.paths['/v1/translation-source'] ??
            body.paths['/translation-source'],
        ).toBeDefined();
        expect(
          body.paths['/v1/ayah-translations'] ??
            body.paths['/ayah-translations'],
        ).toBeDefined();
      });
  });

  it('rejects invalid pagination before reaching the service layer', () => {
    return request(app.getHttpServer())
      .get('/v1/translation-sources?page=0')
      .expect(400);
  });
});
