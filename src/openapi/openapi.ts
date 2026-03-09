import { type INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function registerOpenApiJsonEndpoint(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Quran French API')
    .setDescription('Read-only Quran French API.')
    .setVersion('1.0.0')
    .addServer('/v1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const httpAdapter = app.getHttpAdapter();

  httpAdapter.get('/v1/openapi.json', (_request, response) => {
    httpAdapter.reply(response, document, 200);
  });
}
