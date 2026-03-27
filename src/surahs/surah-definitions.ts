export interface SurahDefinition {
  surahNumber: number;
  canonicalName: string;
  aliases?: string[];
}

function normalizeSurahIdentifier(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/^(surah|sourate|sura)[\s-]+/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const surahDefinitions: SurahDefinition[] = [
  { surahNumber: 1, canonicalName: 'al-fatiha', aliases: ['fatiha'] },
  {
    surahNumber: 2,
    canonicalName: 'al-baqara',
    aliases: ['baqara', 'al-baqarah', 'baqarah'],
  },
  {
    surahNumber: 3,
    canonicalName: 'ali-imran',
    aliases: ['al-imran', 'aal-imran', 'imran'],
  },
  { surahNumber: 4, canonicalName: 'an-nisa', aliases: ['al-nisa', 'nisa'] },
  {
    surahNumber: 5,
    canonicalName: 'al-maida',
    aliases: ['maida', 'al-maidah', 'maidah'],
  },
  { surahNumber: 6, canonicalName: 'al-anam', aliases: ['anam'] },
  { surahNumber: 7, canonicalName: 'al-araf', aliases: ['araf'] },
  { surahNumber: 8, canonicalName: 'al-anfal', aliases: ['anfal'] },
  {
    surahNumber: 9,
    canonicalName: 'at-tawba',
    aliases: ['al-tawba', 'tawba', 'at-tawbah', 'tawbah'],
  },
  { surahNumber: 10, canonicalName: 'yunus' },
  { surahNumber: 11, canonicalName: 'hud' },
  { surahNumber: 12, canonicalName: 'yusuf' },
  {
    surahNumber: 13,
    canonicalName: 'ar-rad',
    aliases: ['al-rad', 'raad', 'rad'],
  },
  { surahNumber: 14, canonicalName: 'ibrahim' },
  { surahNumber: 15, canonicalName: 'al-hijr', aliases: ['hijr'] },
  { surahNumber: 16, canonicalName: 'an-nahl', aliases: ['nahl'] },
  {
    surahNumber: 17,
    canonicalName: 'al-isra',
    aliases: ['isra', 'bani-israil'],
  },
  { surahNumber: 18, canonicalName: 'al-kahf', aliases: ['kahf'] },
  { surahNumber: 19, canonicalName: 'maryam', aliases: ['mariam'] },
  { surahNumber: 20, canonicalName: 'ta-ha', aliases: ['taha'] },
  {
    surahNumber: 21,
    canonicalName: 'al-anbiya',
    aliases: ['anbiya'],
  },
  { surahNumber: 22, canonicalName: 'al-hajj', aliases: ['hajj'] },
  {
    surahNumber: 23,
    canonicalName: 'al-muminun',
    aliases: ['muminun', 'al-mu-minun'],
  },
  { surahNumber: 24, canonicalName: 'an-nur', aliases: ['nur'] },
  { surahNumber: 25, canonicalName: 'al-furqan', aliases: ['furqan'] },
  {
    surahNumber: 26,
    canonicalName: 'ash-shuara',
    aliases: ['al-shuara', 'shuara'],
  },
  { surahNumber: 27, canonicalName: 'an-naml', aliases: ['naml'] },
  { surahNumber: 28, canonicalName: 'al-qasas', aliases: ['qasas'] },
  { surahNumber: 29, canonicalName: 'al-ankabut', aliases: ['ankabut'] },
  { surahNumber: 30, canonicalName: 'ar-rum', aliases: ['rum'] },
  { surahNumber: 31, canonicalName: 'luqman' },
  {
    surahNumber: 32,
    canonicalName: 'as-sajda',
    aliases: ['sajda', 'sajdah'],
  },
  { surahNumber: 33, canonicalName: 'al-ahzab', aliases: ['ahzab'] },
  { surahNumber: 34, canonicalName: 'saba' },
  { surahNumber: 35, canonicalName: 'fatir', aliases: ['faatir'] },
  { surahNumber: 36, canonicalName: 'ya-sin', aliases: ['yasin'] },
  { surahNumber: 37, canonicalName: 'as-saffat', aliases: ['saffat'] },
  { surahNumber: 38, canonicalName: 'sad', aliases: ['saad'] },
  { surahNumber: 39, canonicalName: 'az-zumar', aliases: ['zumar'] },
  {
    surahNumber: 40,
    canonicalName: 'ghafir',
    aliases: ['ghaafir', 'al-mumin', 'mumin'],
  },
  {
    surahNumber: 41,
    canonicalName: 'fussilat',
    aliases: ['ha-mim-as-sajda'],
  },
  { surahNumber: 42, canonicalName: 'ash-shura', aliases: ['shura'] },
  { surahNumber: 43, canonicalName: 'az-zukhruf', aliases: ['zukhruf'] },
  { surahNumber: 44, canonicalName: 'ad-dukhan', aliases: ['dukhan'] },
  {
    surahNumber: 45,
    canonicalName: 'al-jathiya',
    aliases: ['jathiya', 'jathiyah'],
  },
  { surahNumber: 46, canonicalName: 'al-ahqaf', aliases: ['ahqaf'] },
  { surahNumber: 47, canonicalName: 'muhammad' },
  { surahNumber: 48, canonicalName: 'al-fath', aliases: ['fath'] },
  {
    surahNumber: 49,
    canonicalName: 'al-hujurat',
    aliases: ['hujurat'],
  },
  { surahNumber: 50, canonicalName: 'qaf', aliases: ['qaaf'] },
  {
    surahNumber: 51,
    canonicalName: 'adh-dhariyat',
    aliases: ['dhariyat', 'zariyat'],
  },
  { surahNumber: 52, canonicalName: 'at-tur', aliases: ['tur'] },
  { surahNumber: 53, canonicalName: 'an-najm', aliases: ['najm'] },
  { surahNumber: 54, canonicalName: 'al-qamar', aliases: ['qamar'] },
  { surahNumber: 55, canonicalName: 'ar-rahman', aliases: ['rahman'] },
  {
    surahNumber: 56,
    canonicalName: 'al-waqia',
    aliases: ['waqia', 'waqi-ah'],
  },
  { surahNumber: 57, canonicalName: 'al-hadid', aliases: ['hadid'] },
  {
    surahNumber: 58,
    canonicalName: 'al-mujadila',
    aliases: ['mujadila', 'mujadalah', 'mujadala'],
  },
  { surahNumber: 59, canonicalName: 'al-hashr', aliases: ['hashr'] },
  {
    surahNumber: 60,
    canonicalName: 'al-mumtahana',
    aliases: ['mumtahana', 'mumtahanah'],
  },
  { surahNumber: 61, canonicalName: 'as-saff', aliases: ['saff'] },
  {
    surahNumber: 62,
    canonicalName: 'al-jumua',
    aliases: ['jumua', 'jumuah'],
  },
  {
    surahNumber: 63,
    canonicalName: 'al-munafiqun',
    aliases: ['munafiqun'],
  },
  {
    surahNumber: 64,
    canonicalName: 'at-taghabun',
    aliases: ['taghabun'],
  },
  { surahNumber: 65, canonicalName: 'at-talaq', aliases: ['talaq'] },
  { surahNumber: 66, canonicalName: 'at-tahrim', aliases: ['tahrim'] },
  { surahNumber: 67, canonicalName: 'al-mulk', aliases: ['mulk'] },
  { surahNumber: 68, canonicalName: 'al-qalam', aliases: ['qalam', 'nun'] },
  { surahNumber: 69, canonicalName: 'al-haqqa', aliases: ['haqqa'] },
  {
    surahNumber: 70,
    canonicalName: 'al-maarij',
    aliases: ['maarij', 'maarij'],
  },
  { surahNumber: 71, canonicalName: 'nuh', aliases: ['nooh'] },
  { surahNumber: 72, canonicalName: 'al-jinn', aliases: ['jinn'] },
  {
    surahNumber: 73,
    canonicalName: 'al-muzzammil',
    aliases: ['muzzammil'],
  },
  {
    surahNumber: 74,
    canonicalName: 'al-muddaththir',
    aliases: ['muddaththir', 'muddathir'],
  },
  {
    surahNumber: 75,
    canonicalName: 'al-qiyama',
    aliases: ['qiyama', 'qiyamah'],
  },
  {
    surahNumber: 76,
    canonicalName: 'al-insan',
    aliases: ['insan', 'ad-dahr', 'dahr'],
  },
  {
    surahNumber: 77,
    canonicalName: 'al-mursalat',
    aliases: ['mursalat'],
  },
  { surahNumber: 78, canonicalName: 'an-naba', aliases: ['naba', 'nabaa'] },
  {
    surahNumber: 79,
    canonicalName: 'an-naziat',
    aliases: ['naziat', 'naziat'],
  },
  { surahNumber: 80, canonicalName: 'abasa' },
  { surahNumber: 81, canonicalName: 'at-takwir', aliases: ['takwir'] },
  { surahNumber: 82, canonicalName: 'al-infitar', aliases: ['infitar'] },
  {
    surahNumber: 83,
    canonicalName: 'al-mutaffifin',
    aliases: ['mutaffifin'],
  },
  {
    surahNumber: 84,
    canonicalName: 'al-inshiqaq',
    aliases: ['inshiqaq'],
  },
  { surahNumber: 85, canonicalName: 'al-buruj', aliases: ['buruj'] },
  { surahNumber: 86, canonicalName: 'at-tariq', aliases: ['tariq'] },
  {
    surahNumber: 87,
    canonicalName: 'al-ala',
    aliases: ['ala', 'al-a-la', 'al-aala'],
  },
  {
    surahNumber: 88,
    canonicalName: 'al-ghashiya',
    aliases: ['ghashiya', 'ghashiyah'],
  },
  { surahNumber: 89, canonicalName: 'al-fajr', aliases: ['fajr'] },
  { surahNumber: 90, canonicalName: 'al-balad', aliases: ['balad'] },
  { surahNumber: 91, canonicalName: 'ash-shams', aliases: ['shams'] },
  { surahNumber: 92, canonicalName: 'al-layl', aliases: ['layl'] },
  { surahNumber: 93, canonicalName: 'ad-duha', aliases: ['duha'] },
  {
    surahNumber: 94,
    canonicalName: 'ash-sharh',
    aliases: ['sharh', 'al-inshirah', 'inshirah'],
  },
  { surahNumber: 95, canonicalName: 'at-tin', aliases: ['tin'] },
  { surahNumber: 96, canonicalName: 'al-alaq', aliases: ['alaq', 'iqra'] },
  { surahNumber: 97, canonicalName: 'al-qadr', aliases: ['qadr'] },
  {
    surahNumber: 98,
    canonicalName: 'al-bayyina',
    aliases: ['bayyina', 'bayyinah'],
  },
  {
    surahNumber: 99,
    canonicalName: 'az-zalzala',
    aliases: ['zalzala', 'zalzalah'],
  },
  { surahNumber: 100, canonicalName: 'al-adiyat', aliases: ['adiyat'] },
  {
    surahNumber: 101,
    canonicalName: 'al-qaria',
    aliases: ['qaria', 'qariah'],
  },
  {
    surahNumber: 102,
    canonicalName: 'at-takathur',
    aliases: ['takathur'],
  },
  { surahNumber: 103, canonicalName: 'al-asr', aliases: ['asr'] },
  {
    surahNumber: 104,
    canonicalName: 'al-humaza',
    aliases: ['humaza', 'humazah'],
  },
  { surahNumber: 105, canonicalName: 'al-fil', aliases: ['fil'] },
  { surahNumber: 106, canonicalName: 'quraysh', aliases: ['quraish'] },
  { surahNumber: 107, canonicalName: 'al-maun', aliases: ['maun'] },
  {
    surahNumber: 108,
    canonicalName: 'al-kawthar',
    aliases: ['kawthar', 'kauthar'],
  },
  {
    surahNumber: 109,
    canonicalName: 'al-kafirun',
    aliases: ['kafirun', 'kafiroon'],
  },
  { surahNumber: 110, canonicalName: 'an-nasr', aliases: ['nasr'] },
  {
    surahNumber: 111,
    canonicalName: 'al-masad',
    aliases: ['masad', 'al-lahab', 'lahab'],
  },
  { surahNumber: 112, canonicalName: 'al-ikhlas', aliases: ['ikhlas'] },
  { surahNumber: 113, canonicalName: 'al-falaq', aliases: ['falaq'] },
  { surahNumber: 114, canonicalName: 'an-nas', aliases: ['nas'] },
];

const surahDefinitionByNumber = new Map(
  surahDefinitions.map((definition) => [definition.surahNumber, definition]),
);

const surahDefinitionByAlias = new Map<string, SurahDefinition>();

for (const definition of surahDefinitions) {
  const aliases = [definition.canonicalName, ...(definition.aliases ?? [])];

  for (const alias of aliases) {
    surahDefinitionByAlias.set(normalizeSurahIdentifier(alias), definition);
  }
}

export function resolveSurahDefinition(
  surahIdentifier: string,
): SurahDefinition | undefined {
  const normalizedIdentifier = normalizeSurahIdentifier(surahIdentifier);

  if (/^\d+$/.test(normalizedIdentifier)) {
    return getSurahDefinitionByNumber(Number(normalizedIdentifier));
  }

  return surahDefinitionByAlias.get(normalizedIdentifier);
}

export function getSurahDefinitionByNumber(
  surahNumber: number,
): SurahDefinition | undefined {
  return surahDefinitionByNumber.get(surahNumber);
}
