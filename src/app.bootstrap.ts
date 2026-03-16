import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { registerOpenApiEndpoints } from './openapi/openapi';

export function configureApplication(app: INestApplication): void {
  app.setGlobalPrefix('v1');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  registerOpenApiEndpoints(app);
}
