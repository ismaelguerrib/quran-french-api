import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateSurahsTable1774569600000 implements MigrationInterface {
  name = 'CreateSurahsTable1774569600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "surahs" (
        "id" SERIAL NOT NULL,
        "surahNumber" integer NOT NULL,
        "canonicalName" character varying(100) NOT NULL,
        "arabicName" character varying(255),
        CONSTRAINT "PK_surahs_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_surahs_surah_number_unique" ON "surahs" ("surahNumber")',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_surahs_canonical_name_unique" ON "surahs" ("canonicalName")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX IF EXISTS "IDX_surahs_canonical_name_unique"',
    );
    await queryRunner.query(
      'DROP INDEX IF EXISTS "IDX_surahs_surah_number_unique"',
    );
    await queryRunner.query('DROP TABLE "surahs"');
  }
}
