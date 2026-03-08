import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AyahTranslationModule } from './ayah-translations/ayah-translation.module';
import { AyahModule } from './ayahs/ayahs.module';
import { TranslationSourceModule } from './translation-sources/translation-source.module';
const configModule = ConfigModule.forRoot({ isGlobal: true });

const databaseImports =
  process.env.NODE_ENV === 'test'
    ? []
    : [
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
            const databaseUrl = configService.get<string>('DATABASE_URL');
            const sslEnabled =
              configService.get<string>('DB_SSL', 'false').toLowerCase() ===
              'true';
            const loggingEnabled =
              configService.get<string>('DB_LOGGING', 'false').toLowerCase() ===
              'true';
            const poolMax = Number(
              configService.get<string>('DB_POOL_MAX', '10'),
            );
            const connectionPoolMax = Number.isNaN(poolMax) ? 10 : poolMax;

            if (databaseUrl) {
              return {
                type: 'postgres',
                url: databaseUrl,
                ssl: sslEnabled ? { rejectUnauthorized: false } : false,
                autoLoadEntities: true,
                synchronize: false,
                logging: loggingEnabled,
                extra: {
                  max: connectionPoolMax,
                },
              };
            }

            const port = Number(configService.get<string>('DB_PORT', '5432'));

            return {
              type: 'postgres',
              host: configService.get<string>('DB_HOST', '127.0.0.1'),
              port: Number.isNaN(port) ? 5432 : port,
              username: configService.get<string>('DB_USERNAME', 'quran_api'),
              password: configService.get<string>('DB_PASSWORD', 'quran_api'),
              database: configService.get<string>(
                'DB_NAME',
                'quran_french_api',
              ),
              ssl: sslEnabled ? { rejectUnauthorized: false } : false,
              autoLoadEntities: true,
              synchronize: false,
              logging: loggingEnabled,
              extra: {
                max: connectionPoolMax,
              },
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
