const TRUE_OR_FALSE = new Set(['true', 'false']);

function readOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

function parseNumber(
  value: string | undefined,
  fieldName: string,
  fallback: number,
  min: number,
  max: number,
): string {
  if (!value) {
    return String(fallback);
  }

  const parsedValue = Number(value);
  if (!Number.isInteger(parsedValue) || parsedValue < min || parsedValue > max) {
    throw new Error(`${fieldName} must be an integer between ${min} and ${max}.`);
  }

  return String(parsedValue);
}

function parseBoolean(
  value: string | undefined,
  fieldName: string,
  fallback: 'true' | 'false',
): 'true' | 'false' {
  if (!value) {
    return fallback;
  }

  const normalizedValue = value.toLowerCase();
  if (!TRUE_OR_FALSE.has(normalizedValue)) {
    throw new Error(`${fieldName} must be either "true" or "false".`);
  }

  return normalizedValue as 'true' | 'false';
}

function validateDatabaseUrl(value: string): void {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error('DATABASE_URL must be a valid URL.');
  }

  if (url.protocol !== 'postgres:' && url.protocol !== 'postgresql:') {
    throw new Error('DATABASE_URL must use postgres:// or postgresql:// protocol.');
  }
}

export function validateEnv(
  config: Record<string, unknown>,
): Record<string, string> {
  const nodeEnv = readOptionalString(config.NODE_ENV) ?? 'development';
  const databaseUrl = readOptionalString(config.DATABASE_URL);
  const dbHost = readOptionalString(config.DB_HOST) ?? '127.0.0.1';
  const dbUsername = readOptionalString(config.DB_USERNAME) ?? 'quran_api';
  const dbPassword = readOptionalString(config.DB_PASSWORD) ?? 'quran_api';
  const dbName = readOptionalString(config.DB_NAME) ?? 'quran_french_api';

  if (databaseUrl) {
    validateDatabaseUrl(databaseUrl);
  }

  if (nodeEnv === 'production' && !databaseUrl) {
    const requiredFields = [
      'DB_HOST',
      'DB_PORT',
      'DB_USERNAME',
      'DB_PASSWORD',
      'DB_NAME',
    ];
    const missingFields = requiredFields.filter(
      (field) => !readOptionalString(config[field]),
    );

    if (missingFields.length > 0) {
      throw new Error(
        `Missing required environment variables in production: ${missingFields.join(', ')}.`,
      );
    }
  }

  return {
    NODE_ENV: nodeEnv,
    PORT: parseNumber(readOptionalString(config.PORT), 'PORT', 3000, 1, 65535),
    DATABASE_URL: databaseUrl ?? '',
    DB_HOST: dbHost,
    DB_PORT: parseNumber(
      readOptionalString(config.DB_PORT),
      'DB_PORT',
      5432,
      1,
      65535,
    ),
    DB_USERNAME: dbUsername,
    DB_PASSWORD: dbPassword,
    DB_NAME: dbName,
    DB_SSL: parseBoolean(readOptionalString(config.DB_SSL), 'DB_SSL', 'false'),
    DB_LOGGING: parseBoolean(
      readOptionalString(config.DB_LOGGING),
      'DB_LOGGING',
      'false',
    ),
    DB_POOL_MAX: parseNumber(
      readOptionalString(config.DB_POOL_MAX),
      'DB_POOL_MAX',
      10,
      1,
      100,
    ),
  };
}
