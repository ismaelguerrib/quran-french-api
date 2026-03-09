import {
  type MigrationInterface,
  type QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class InitSchema1741521600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'ayahs',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'surahNumber',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'ayahNumber',
            type: 'integer',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'ayahs',
      new TableIndex({
        name: 'IDX_ayahs_surah_number_ayah_number_unique',
        columnNames: ['surahNumber', 'ayahNumber'],
        isUnique: true,
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'translation_sources',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'code',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'label',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'language',
            type: 'varchar',
            length: '10',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'translation_sources',
      new TableIndex({
        name: 'IDX_translation_sources_code_unique',
        columnNames: ['code'],
        isUnique: true,
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'ayah_translations',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'ayahId',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'translationSourceId',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'text',
            type: 'text',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'ayah_translations',
      new TableIndex({
        name: 'IDX_ayah_translations_ayah_id_translation_source_id_unique',
        columnNames: ['ayahId', 'translationSourceId'],
        isUnique: true,
      }),
    );

    await queryRunner.createForeignKey(
      'ayah_translations',
      new TableForeignKey({
        name: 'FK_ayah_translations_ayah_id',
        columnNames: ['ayahId'],
        referencedTableName: 'ayahs',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'ayah_translations',
      new TableForeignKey({
        name: 'FK_ayah_translations_translation_source_id',
        columnNames: ['translationSourceId'],
        referencedTableName: 'translation_sources',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'ayah_translations',
      'FK_ayah_translations_translation_source_id',
    );
    await queryRunner.dropForeignKey(
      'ayah_translations',
      'FK_ayah_translations_ayah_id',
    );
    await queryRunner.dropIndex(
      'ayah_translations',
      'IDX_ayah_translations_ayah_id_translation_source_id_unique',
    );
    await queryRunner.dropTable('ayah_translations');

    await queryRunner.dropIndex(
      'translation_sources',
      'IDX_translation_sources_code_unique',
    );
    await queryRunner.dropTable('translation_sources');

    await queryRunner.dropIndex(
      'ayahs',
      'IDX_ayahs_surah_number_ayah_number_unique',
    );
    await queryRunner.dropTable('ayahs');
  }
}
