import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { registerOpenApiJsonEndpoint } from '../src/openapi/openapi';
import { AppModule } from './../src/app.module';

describe('Quran French API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('v1');
    registerOpenApiJsonEndpoint(app);
    await app.init();
  });

  it('/v1/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/v1/health')
      .expect(200)
      .expect({ status: 'ok' });
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
          body.paths['/v1/translation-source'] ??
            body.paths['/translation-source'],
        ).toBeDefined();
        expect(
          body.paths['/v1/ayah-translations'] ??
            body.paths['/ayah-translations'],
        ).toBeDefined();
      });
  });
});
