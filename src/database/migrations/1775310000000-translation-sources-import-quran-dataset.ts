import { type MigrationInterface, type QueryRunner } from 'typeorm';

type TranslationSourceSeedRow = readonly [
  code: string,
  label: string,
  language: string,
  chronologicalOrder: number,
];

type SqlLiteral = number | string | null;
type SqlRow = readonly SqlLiteral[];

export class TranslationSourcesImportQuranDataset1775310000000 implements MigrationInterface {
  name = 'TranslationSourcesImportQuranDataset1775310000000';

  private static readonly translationSourceRows: readonly TranslationSourceSeedRow[] = [
    ["a-arabe-ar", "a- arabe", "ar", 0],
    ["a-translitteration-ar-latn", "a- Translittération", "ar-Latn", 0],
    ["du-ryer-fr", "Du Ryer", "fr", 1],
    ["savary-fr", "Savary", "fr", 2],
    ["kazimirski-fr", "Kazimirski", "fr", 3],
    ["montet-fr", "Montet", "fr", 4],
    ["laimeche-fr", "Laïmèche", "fr", 5],
    ["pesle-tidjani-fr", "Pesle-Tidjani", "fr", 6],
    ["blachere-fr", "Blachère", "fr", 7],
    ["ghedira-fr", "Ghedira", "fr", 8],
    ["hamidullah-fr", "Hamidullah", "fr", 9],
    ["boudib-fr", "Boudib", "fr", 10],
    ["masson-fr", "Masson", "fr", 11],
    ["boubakeur-fr", "Boubakeur", "fr", 12],
    ["masson-saleh-fr", "Masson-Saleh", "fr", 13],
    ["grosjean-fr", "Grosjean", "fr", 14],
    ["mazigh-fr", "Mazigh", "fr", 15],
    ["kechrid-fr", "Kechrid", "fr", 16],
    ["ahmadayyia-fr", "Ahmadayyia", "fr", 17],
    ["nahaboo-fr", "Nahaboo", "fr", 18],
    ["khawam-fr", "Khawam", "fr", 19],
    ["chouraqui-fr", "Chouraqui", "fr", 20],
    ["valois-fr", "Valois", "fr", 21],
    ["berque-fr", "Berque", "fr", 22],
    ["hamidullah-revise-fr", "Hamidullah révisé", "fr", 23],
    ["montakhab-fr", "Montakhab", "fr", 24],
    ["ben-mahmoud-fr", "Ben Mahmoud", "fr", 25],
    ["chiadmi-fr", "Chiadmi", "fr", 26],
    ["boureima-fr", "Boureïma", "fr", 27],
    ["fakhri-fr", "Fakhri", "fr", 28],
    ["ould-bah-fr", "Ould Bah", "fr", 29],
    ["penot-fr", "Penot", "fr", 30],
    ["hafiane-fr", "Hafiane", "fr", 31],
    ["aldeeb-fr", "Aldeeb", "fr", 32],
    ["z-abdelaziz-fr", "Z. Abdelaziz", "fr", 33],
    ["chebel-fr", "Chebel", "fr", 34],
    ["shahira-fr", "Shahira", "fr", 35],
    ["aysar-t-trad-fr", "Aysar t. trad", "fr", 36],
    ["michon-fr", "Michon", "fr", 37],
    ["gloton-fr", "Gloton", "fr", 38],
    ["zeino-fr", "Zeino", "fr", 39],
    ["yildirim-fr", "Yildirim", "fr", 40],
    ["bonaud-fr", "Bonaud", "fr", 41],
  ];

  private static async assertTableExists(
    queryRunner: QueryRunner,
    tableName: string,
  ): Promise<void> {
    const tableExists = await queryRunner.hasTable(tableName);

    if (!tableExists) {
      throw new Error(
        `Required table "${tableName}" is missing. Run the schema migrations before importing the Quran dataset.`,
      );
    }
  }

  private static async assertTablesExist(
    queryRunner: QueryRunner,
    tableNames: readonly string[],
  ): Promise<void> {
    for (const tableName of tableNames) {
      await TranslationSourcesImportQuranDataset1775310000000.assertTableExists(queryRunner, tableName);
    }
  }

  private static formatSqlLiteral(value: SqlLiteral): string {
    if (value === null) {
      return 'NULL';
    }

    if (typeof value === 'number') {
      return String(value);
    }

    return `'${value.replace(/'/g, "''")}'`;
  }

  private static formatValues(rows: readonly SqlRow[]): string {
    return rows
      .map(
        (row) => `(${row.map((value) => TranslationSourcesImportQuranDataset1775310000000.formatSqlLiteral(value)).join(', ')})`,
      )
      .join(',\n');
  }

  private static async runBatchedStatements(
    queryRunner: QueryRunner,
    rows: readonly SqlRow[],
    batchSize: number,
    buildSql: (batchedRows: readonly SqlRow[]) => string,
  ): Promise<void> {
    for (let offset = 0; offset < rows.length; offset += batchSize) {
      const batchedRows = rows.slice(offset, offset + batchSize);
      await queryRunner.query(buildSql(batchedRows));
    }
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await TranslationSourcesImportQuranDataset1775310000000.assertTablesExist(queryRunner, ['translation_sources']);
    await TranslationSourcesImportQuranDataset1775310000000.runBatchedStatements(
      queryRunner,
      TranslationSourcesImportQuranDataset1775310000000.translationSourceRows,
      100,
      (batchedRows) => `
        INSERT INTO "translation_sources" (
          "code",
          "label",
          "language",
          "chronologicalOrder"
        )
        VALUES ${TranslationSourcesImportQuranDataset1775310000000.formatValues(batchedRows)}
        ON CONFLICT ("code") DO UPDATE SET
          "label" = EXCLUDED."label",
          "language" = EXCLUDED."language",
          "chronologicalOrder" = EXCLUDED."chronologicalOrder"
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await TranslationSourcesImportQuranDataset1775310000000.assertTablesExist(queryRunner, ['translation_sources']);
    await TranslationSourcesImportQuranDataset1775310000000.runBatchedStatements(
      queryRunner,
      TranslationSourcesImportQuranDataset1775310000000.translationSourceRows.map(([sourceCode]) => [sourceCode] as const),
      100,
      (batchedRows) => `
        DELETE FROM "translation_sources"
        WHERE "code" IN (
          SELECT "sourceCode"
          FROM (VALUES ${TranslationSourcesImportQuranDataset1775310000000.formatValues(batchedRows)}) AS "seedRows"("sourceCode")
        )
      `,
    );
  }
}
