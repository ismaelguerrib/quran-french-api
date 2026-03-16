import { type INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function registerOpenApiEndpoints(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Quran French API')
    .setDescription(
      'Public read-only API exposing Quran verse keys, translation sources, and multiple French translations derived from the CSV source dataset.',
    )
    .setVersion('1.0.0')
    .addServer('/v1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/v1/docs', app, document, {
    jsonDocumentUrl: '/v1/openapi.json',
  });
  const httpAdapter = app.getHttpAdapter();

  httpAdapter.get('/v1/openapi.json', (_request, response) => {
    httpAdapter.reply(response, document, 200);
  });
}
