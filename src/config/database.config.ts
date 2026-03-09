import { type PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export interface DatabaseEnv {
  DATABASE_URL?: string;
  DB_HOST?: string;
  DB_PORT?: string;
  DB_USERNAME?: string;
  DB_PASSWORD?: string;
  DB_NAME?: string;
  DB_SSL?: string;
  DB_LOGGING?: string;
  DB_POOL_MAX?: string;
}

const DEFAULT_DB_HOST = '127.0.0.1';
const DEFAULT_DB_PORT = 5432;
const DEFAULT_DB_USERNAME = 'quran_api';
const DEFAULT_DB_PASSWORD = 'quran_api';
const DEFAULT_DB_NAME = 'quran_french_api';
const DEFAULT_DB_POOL_MAX = 10;

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) {
    return fallback;
  }

  return value.toLowerCase() === 'true';
}

function parseInteger(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsedValue = Number(value);
  return Number.isNaN(parsedValue) ? fallback : parsedValue;
}

export function createDatabaseOptions(
  env: DatabaseEnv,
): Omit<
  PostgresConnectionOptions,
  'entities' | 'migrations' | 'autoLoadEntities' | 'synchronize'
> {
  const sslEnabled = parseBoolean(env.DB_SSL, false);
  const loggingEnabled = parseBoolean(env.DB_LOGGING, false);
  const connectionPoolMax = parseInteger(env.DB_POOL_MAX, DEFAULT_DB_POOL_MAX);

  if (env.DATABASE_URL) {
    return {
      type: 'postgres',
      url: env.DATABASE_URL,
      ssl: sslEnabled ? { rejectUnauthorized: false } : false,
      logging: loggingEnabled,
      extra: {
        max: connectionPoolMax,
      },
    };
  }

  return {
    type: 'postgres',
    host: env.DB_HOST ?? DEFAULT_DB_HOST,
    port: parseInteger(env.DB_PORT, DEFAULT_DB_PORT),
    username: env.DB_USERNAME ?? DEFAULT_DB_USERNAME,
    password: env.DB_PASSWORD ?? DEFAULT_DB_PASSWORD,
    database: env.DB_NAME ?? DEFAULT_DB_NAME,
    ssl: sslEnabled ? { rejectUnauthorized: false } : false,
    logging: loggingEnabled,
    extra: {
      max: connectionPoolMax,
    },
  };
}
