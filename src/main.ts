import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { registerOpenApiJsonEndpoint } from './openapi/openapi';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');
  registerOpenApiJsonEndpoint(app);
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
