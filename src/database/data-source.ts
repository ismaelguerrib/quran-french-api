import 'dotenv/config';
import { DataSource } from 'typeorm';
import { AyahTranslationEntity } from '../ayah-translations/entities/ayah-translation.entity';
import { AyahEntity } from '../ayahs/entities/ayah.entity';
import { createDatabaseOptions } from '../config/database.config';
import { SurahEntity } from '../surahs/entities/surah.entity';
import { validateEnv } from '../config/env.validation';
import { TranslationSourceEntity } from '../translation-sources/entities/translation-source.entity';

const validatedEnv = validateEnv(process.env as Record<string, unknown>);
const baseOptions = createDatabaseOptions(validatedEnv);

const AppDataSource = new DataSource({
  ...baseOptions,
  entities: [
    AyahEntity,
    AyahTranslationEntity,
    SurahEntity,
    TranslationSourceEntity,
  ],
  migrations: ['src/database/migrations/*.ts'],
});

export default AppDataSource;
