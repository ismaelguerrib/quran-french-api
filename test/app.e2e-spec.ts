import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Quran French API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('v1');
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

        expect(body.openapi).toBe('3.0.3');
        expect(body.paths['/verses/{surahNumber}/{ayahNumber}']).toBeDefined();
      });
  });

  it('/v1/verses/2/255 (GET)', () => {
    return request(app.getHttpServer())
      .get('/v1/verses/2/255?source=hamidullah-fr,masson-fr')
      .expect(200)
      .expect({
        surahNumber: 2,
        ayahNumber: 255,
        translations: [
          { source: 'hamidullah-fr', author: null, text: null },
          { source: 'masson-fr', author: null, text: null },
        ],
      });
  });

  it('/v1/verses/2/255 (GET) should reject invalid source', () => {
    return request(app.getHttpServer()).get('/v1/verses/2/255').expect(404);
  });
});
