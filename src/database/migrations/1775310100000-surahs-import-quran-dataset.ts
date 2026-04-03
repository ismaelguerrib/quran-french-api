import { type MigrationInterface, type QueryRunner } from 'typeorm';

type SurahSeedRow = readonly [
  surahNumber: number,
  canonicalName: string,
  arabicName: string | null,
];

type SqlLiteral = number | string | null;
type SqlRow = readonly SqlLiteral[];

export class SurahsImportQuranDataset1775310100000 implements MigrationInterface {
  name = 'SurahsImportQuranDataset1775310100000';

  private static readonly surahRows: readonly SurahSeedRow[] = [
    [1, "al-fatiha", "الفاتحة"],
    [2, "al-baqara", "سُورةُ البَقَرَةِ"],
    [3, "ali-imran", "سُورةُ آل عمران"],
    [4, "an-nisa", "سُورةُ النِّسَاءِ"],
    [5, "al-maida", "سُورةُ المَاىِدَةِ"],
    [6, "al-anam", "سُورةُ الأَنْعَامِ"],
    [7, "al-araf", "سُورةُ الأَعْرَاف"],
    [8, "al-anfal", "سُورةُ الأَنْفَالِ"],
    [9, "at-tawba", "سُورةُ التَّوْبَةِ"],
    [10, "yunus", "سُورةُ يُونُس"],
    [11, "hud", "سُورةُ هُود"],
    [12, "yusuf", "سُورةُ يُوسُف"],
    [13, "ar-rad", "سُورةُ الرَّعْدِ"],
    [14, "ibrahim", "سُورةُ إبْرَاهِيم"],
    [15, "al-hijr", "سُورةُ الحِجْرِ"],
    [16, "an-nahl", "سُورةُ النَّحْلِ"],
    [17, "al-isra", "سُورةُ الإٍسْرَاءِ"],
    [18, "al-kahf", "سُورةُ الكَهْفِ"],
    [19, "maryam", "سُورةُ مَرْيَم"],
    [20, "ta-ha", "سُورةُ طه"],
    [21, "al-anbiya", "سُورةُ الأنْبِيَاءِ"],
    [22, "al-hajj", "سُورةُ الحَّجِّ"],
    [23, "al-muminun", "سُورةُ المُؤمِنُونَ"],
    [24, "an-nur", "سُورةُ النُّورِ"],
    [25, "al-furqan", "سُورةُ الفُرْقانِ"],
    [26, "ash-shuara", "سُورةُ الشُّعَرَاء"],
    [27, "an-naml", "سُورةُ النَّمْلِ"],
    [28, "al-qasas", "سُورةُ القَصَصِ"],
    [29, "al-ankabut", "سُورةُ العَنكبوتِ"],
    [30, "ar-rum", "سُورةُ الرُّومِ"],
    [31, "luqman", "سُورةُ لقمَان"],
    [32, "as-sajda", "سُورةُ السَّجدَة"],
    [33, "al-ahzab", "سُورةُ الأحزَابِ"],
    [34, "saba", "سُورةُ سَبَأ"],
    [35, "fatir", "سُورةُ فَاطِر"],
    [36, "ya-sin", "سُورةُ يس"],
    [37, "as-saffat", "سُورةُ الصَّافات"],
    [38, "sad", "سُورةُ ص"],
    [39, "az-zumar", "سُورةُ الزُّمَر"],
    [40, "ghafir", "سُورةُ غَافِر"],
    [41, "fussilat", "سُورةُ فُصِّلَتْ"],
    [42, "ash-shura", "سُورةُ الشُّورَى"],
    [43, "az-zukhruf", "سُورةُ الزُّخْرُف"],
    [44, "ad-dukhan", "سُورةُ الدخَان"],
    [45, "al-jathiya", "سُورةُ الجَاثيَة"],
    [46, "al-ahqaf", "سُورةُ الأحْقاف"],
    [47, "muhammad", "سُورةُ محَمَّد"],
    [48, "al-fath", "سُورةُ الفَتْح"],
    [49, "al-hujurat", "سُورةُ الحُجرَات"],
    [50, "qaf", "سُورةُ ق"],
    [51, "adh-dhariyat", "سُورةُ الذَّاريَات"],
    [52, "at-tur", "سُورةُ الطُّور"],
    [53, "an-najm", "سُورةُ النَّجْم "],
    [54, "al-qamar", "سُورةُ القَمَر "],
    [55, "ar-rahman", "سُورةُ الرَّحمن "],
    [56, "al-waqia", "سُورةُ الوَاقِعَة "],
    [57, "al-hadid", "سُورةُ الحَديد "],
    [58, "al-mujadila", "سُورةُ المجَادلة "],
    [59, "al-hashr", "سُورةُ الحَشر "],
    [60, "al-mumtahana", "سُورةُ المُمتَحنَة "],
    [61, "as-saff", "سُورةُ الصَّف "],
    [62, "al-jumua", "سُورةُ الجُمُعَة "],
    [63, "al-munafiqun", "سُورةُ المنَافِقون "],
    [64, "at-taghabun", "سُورةُ التغَابُن "],
    [65, "at-talaq", "سُورةُ الطلَاق "],
    [66, "at-tahrim", "سُورةُ التحْريم "],
    [67, "al-mulk", "سُورةُ المُلْكِ"],
    [68, "al-qalam", "سُورةُ القَلَمِ"],
    [69, "al-haqqa", "سُورةُ الحَاقَّةُ"],
    [70, "al-maarij", "سُورةُ المَعَارِجِ"],
    [71, "nuh", "سُورةُ نُوح"],
    [72, "al-jinn", "سُورةُ الجِنِّ"],
    [73, "al-muzzammil", "سُورةُ المُزَّمِّلُ"],
    [74, "al-muddaththir", "سُورةُ المُدَّثِّر"],
    [75, "al-qiyama", "سُورةُ القِيَامَةِ"],
    [76, "al-insan", "سُورةُ الإنْسَانِ"],
    [77, "al-mursalat", "سُورةُ المُرْسَلاتِ"],
    [78, "an-naba", "سُورةُ النَّبَإِ"],
    [79, "an-naziat", "سُورةُ النَّازِعَاتِ"],
    [80, "abasa", "سُورةُ عَبَسَ"],
    [81, "at-takwir", "سُورةُ التَّكْوِيْرِ"],
    [82, "al-infitar", "سُورةُ الانفِطَارِ"],
    [83, "al-mutaffifin", "سُورةُ المَطَفِّفِينَ"],
    [84, "al-inshiqaq", "سُورةُ الانْشِقَاقِ"],
    [85, "al-buruj", "سُورةُ البُرُوجِ"],
    [86, "at-tariq", "سُورةُ الطَّارِقِ"],
    [87, "al-ala", "سُورةُ الأعْلَى"],
    [88, "al-ghashiya", "سُورةُ الغَاشِيَةِ"],
    [89, "al-fajr", "سُورةُ الفَجْرِ"],
    [90, "al-balad", "سُورةُ البَلَدِ"],
    [91, "ash-shams", "سُورةُ الشَّمْسِ"],
    [92, "al-layl", "سُورةُ اللَّيْلِ"],
    [93, "ad-duha", "سُورةُ الضُّحَى"],
    [94, "ash-sharh", "سُورةُ الشَّرْحِ"],
    [95, "at-tin", "سُورةُ التِّينِ"],
    [96, "al-alaq", "سُورةُ العَلَقِ"],
    [97, "al-qadr", "سُورةُ القَدْرِ"],
    [98, "al-bayyina", "سُورةُ البَيِّنَةِ"],
    [99, "az-zalzala", "سُورةُ الزَّلْزَلَةِ"],
    [100, "al-adiyat", "سُورةُ العَادِيَاتِ"],
    [101, "al-qaria", "سُورةُ القَارِعَةِ"],
    [102, "at-takathur", "سُورةُ التَكَاثُرِ"],
    [103, "al-asr", "سُورةُ العُصْرِ"],
    [104, "al-humaza", "سُورةُ الهُمَزَةِ"],
    [105, "al-fil", "سُورةُ الفِيلٍ"],
    [106, "quraysh", "سُورةُ قُرَيْشٍ"],
    [107, "al-maun", "سُورةُ المَاعُونَ"],
    [108, "al-kawthar", "سُورةُ الكَوْثَرِ"],
    [109, "al-kafirun", "سُورةُ الكَافِرُونَ"],
    [110, "an-nasr", "سُورةُ النَّصرٍ"],
    [111, "al-masad", "سُورةُ المَسَدِ"],
    [112, "al-ikhlas", "سُورةُ الاخلاصٍ"],
    [113, "al-falaq", "سُورةُ الفَلَقِ"],
    [114, "an-nas", "سُورةُ النَّاسٍ"],
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
      await SurahsImportQuranDataset1775310100000.assertTableExists(queryRunner, tableName);
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
        (row) => `(${row.map((value) => SurahsImportQuranDataset1775310100000.formatSqlLiteral(value)).join(', ')})`,
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
    await SurahsImportQuranDataset1775310100000.assertTablesExist(queryRunner, ['surahs']);
    await SurahsImportQuranDataset1775310100000.runBatchedStatements(
      queryRunner,
      SurahsImportQuranDataset1775310100000.surahRows,
      150,
      (batchedRows) => `
        INSERT INTO "surahs" (
          "surahNumber",
          "canonicalName",
          "arabicName"
        )
        VALUES ${SurahsImportQuranDataset1775310100000.formatValues(batchedRows)}
        ON CONFLICT ("surahNumber") DO UPDATE SET
          "canonicalName" = EXCLUDED."canonicalName",
          "arabicName" = EXCLUDED."arabicName"
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await SurahsImportQuranDataset1775310100000.assertTablesExist(queryRunner, ['surahs']);
    await SurahsImportQuranDataset1775310100000.runBatchedStatements(
      queryRunner,
      SurahsImportQuranDataset1775310100000.surahRows.map(([surahNumber]) => [surahNumber] as const),
      150,
      (batchedRows) => `
        DELETE FROM "surahs"
        WHERE "surahNumber" IN (
          SELECT "surahNumber"
          FROM (VALUES ${SurahsImportQuranDataset1775310100000.formatValues(batchedRows)}) AS "seedRows"("surahNumber")
        )
      `,
    );
  }
}
