import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  health() {
    return { status: 'ok' };
  }

  @Get('openapi.json')
  openApi() {
    return {
      openapi: '3.0.3',
      info: {
        title: 'Quran French API',
        version: '1.0.0',
      },
      servers: [{ url: '/v1' }],
      paths: {
        '/health': {
          get: {
            summary: 'Healthcheck endpoint',
            responses: {
              '200': { description: 'Service available' },
            },
          },
        },
        '/verses/{surahNumber}/{ayahNumber}': {
          get: {
            summary: 'Get Quran verse translations',
            parameters: [
              {
                in: 'path',
                name: 'surahNumber',
                required: true,
                schema: { type: 'integer', minimum: 1 },
              },
              {
                in: 'path',
                name: 'ayahNumber',
                required: true,
                schema: { type: 'integer', minimum: 1 },
              },
              {
                in: 'query',
                name: 'source',
                required: true,
                schema: { type: 'string' },
                description: 'Comma-separated translation source slugs',
              },
            ],
            responses: {
              '200': { description: 'Verse with selected translations' },
            },
          },
        },
      },
    };
  }
}
