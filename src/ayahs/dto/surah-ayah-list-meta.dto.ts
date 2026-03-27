import { ApiProperty } from '@nestjs/swagger';

export class SurahAyahListMetaDto {
  @ApiProperty({ example: 2 })
  surahNumber!: number;

  @ApiProperty({
    description: 'Canonical normalized surah name used by the API.',
    example: 'al-baqara',
  })
  surahName!: string;

  @ApiProperty({
    description:
      'Number of verse rows returned for the surah, including special dataset rows such as 0 or 0,5 when present.',
    example: 287,
  })
  total!: number;
}
