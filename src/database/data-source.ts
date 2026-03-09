import 'dotenv/config';
import { DataSource } from 'typeorm';
import { type PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { AyahTranslationEntity } from '../ayah-translations/entities/ayah-translation.entity';
import { AyahEntity } from '../ayahs/entities/ayah.entity';
import { TranslationSourceEntity } from '../translation-sources/entities/translation-source.entity';

const sslEnabled = (process.env.DB_SSL ?? 'false').toLowerCase() === 'true';
const loggingEnabled =
  (process.env.DB_LOGGING ?? 'false').toLowerCase() === 'true';
const parsedPoolMax = Number(process.env.DB_POOL_MAX ?? '10');
const connectionPoolMax = Number.isNaN(parsedPoolMax) ? 10 : parsedPoolMax;

const baseOptions: Omit<
  PostgresConnectionOptions,
  'entities' | 'migrations'
> =
  process.env.DATABASE_URL
    ? {
        type: 'postgres',
        url: process.env.DATABASE_URL,
        ssl: sslEnabled ? { rejectUnauthorized: false } : false,
        logging: loggingEnabled,
        extra: {
          max: connectionPoolMax,
        },
      }
    : {
        type: 'postgres',
        host: process.env.DB_HOST ?? '127.0.0.1',
        port: Number(process.env.DB_PORT ?? '5432') || 5432,
        username: process.env.DB_USERNAME ?? 'quran_api',
        password: process.env.DB_PASSWORD ?? 'quran_api',
        database: process.env.DB_NAME ?? 'quran_french_api',
        ssl: sslEnabled ? { rejectUnauthorized: false } : false,
        logging: loggingEnabled,
        extra: {
          max: connectionPoolMax,
        },
      };

const AppDataSource = new DataSource({
  ...baseOptions,
  entities: [AyahEntity, AyahTranslationEntity, TranslationSourceEntity],
  migrations: ['src/database/migrations/*.ts'],
});

export default AppDataSource;
