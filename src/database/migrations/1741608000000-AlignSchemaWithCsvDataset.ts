import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class AlignSchemaWithCsvDataset1741608000000 implements MigrationInterface {
  name = 'AlignSchemaWithCsvDataset1741608000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX IF EXISTS "IDX_ayahs_surah_number_ayah_number_unique"',
    );
    await queryRunner.query(
      'ALTER TABLE "ayahs" RENAME COLUMN "ayahNumber" TO "verseNumber"',
    );
    await queryRunner.query(
      'ALTER TABLE "ayahs" ALTER COLUMN "verseNumber" DROP NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "ayahs" ADD COLUMN "verseKey" character varying(50)',
    );
    await queryRunner.query(
      'UPDATE "ayahs" SET "verseKey" = "verseNumber"::text WHERE "verseKey" IS NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "ayahs" ALTER COLUMN "verseKey" SET NOT NULL',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_ayahs_surah_number_verse_key_unique" ON "ayahs" ("surahNumber", "verseKey")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_ayahs_surah_number_verse_number" ON "ayahs" ("surahNumber", "verseNumber")',
    );

    await queryRunner.query(
      'ALTER TABLE "translation_sources" ADD COLUMN "chronologicalOrder" integer',
    );

    await queryRunner.query(
      'ALTER TABLE "ayah_translations" ADD COLUMN "reference" character varying(100)',
    );
    await queryRunner.query(
      'ALTER TABLE "ayah_translations" ADD COLUMN "wordCount" integer',
    );
    await queryRunner.query(
      'UPDATE "ayah_translations" SET "reference" = CONCAT(\'legacy-\', "id") WHERE "reference" IS NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "ayah_translations" ALTER COLUMN "reference" SET NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "ayah_translations" ALTER COLUMN "text" DROP NOT NULL',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_ayah_translations_translation_source_id" ON "ayah_translations" ("translationSourceId")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX IF EXISTS "IDX_ayah_translations_translation_source_id"',
    );
    await queryRunner.query(
      'UPDATE "ayah_translations" SET "text" = \'\' WHERE "text" IS NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "ayah_translations" ALTER COLUMN "text" SET NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "ayah_translations" DROP COLUMN "wordCount"',
    );
    await queryRunner.query(
      'ALTER TABLE "ayah_translations" DROP COLUMN "reference"',
    );

    await queryRunner.query(
      'ALTER TABLE "translation_sources" DROP COLUMN "chronologicalOrder"',
    );

    await queryRunner.query(
      'DROP INDEX IF EXISTS "IDX_ayahs_surah_number_verse_number"',
    );
    await queryRunner.query(
      'DROP INDEX IF EXISTS "IDX_ayahs_surah_number_verse_key_unique"',
    );
    await queryRunner.query(
      `UPDATE "ayahs"
       SET "verseNumber" = CASE
         WHEN "verseNumber" IS NOT NULL THEN "verseNumber"
         WHEN "verseKey" ~ '^[0-9]+$' THEN CAST("verseKey" AS integer)
         ELSE 0
       END`,
    );
    await queryRunner.query('ALTER TABLE "ayahs" DROP COLUMN "verseKey"');
    await queryRunner.query(
      'ALTER TABLE "ayahs" ALTER COLUMN "verseNumber" SET NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "ayahs" RENAME COLUMN "verseNumber" TO "ayahNumber"',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_ayahs_surah_number_ayah_number_unique" ON "ayahs" ("surahNumber", "ayahNumber")',
    );
  }
}
