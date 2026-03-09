import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AyahTranslationModule } from './ayah-translations/ayah-translation.module';
import { AyahModule } from './ayahs/ayahs.module';
import {
  createDatabaseOptions,
  type DatabaseEnv,
} from './config/database.config';
import { validateEnv } from './config/env.validation';
import { TranslationSourceModule } from './translation-sources/translation-source.module';

const configModule = ConfigModule.forRoot({
  isGlobal: true,
  validate: validateEnv,
});

const databaseImports =
  process.env.NODE_ENV === 'test'
    ? []
    : [
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
            const databaseEnv: DatabaseEnv = {
              DATABASE_URL: configService.get<string>('DATABASE_URL'),
              DB_HOST: configService.get<string>('DB_HOST'),
              DB_PORT: configService.get<string>('DB_PORT'),
              DB_USERNAME: configService.get<string>('DB_USERNAME'),
              DB_PASSWORD: configService.get<string>('DB_PASSWORD'),
              DB_NAME: configService.get<string>('DB_NAME'),
              DB_SSL: configService.get<string>('DB_SSL'),
              DB_LOGGING: configService.get<string>('DB_LOGGING'),
              DB_POOL_MAX: configService.get<string>('DB_POOL_MAX'),
            };

            return {
              ...createDatabaseOptions(databaseEnv),
              autoLoadEntities: true,
              synchronize: false,
            };
          },
        }),
      ];

@Module({
  imports: [
    configModule,
    ...databaseImports,
    AyahModule,
    AyahTranslationModule,
    TranslationSourceModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
