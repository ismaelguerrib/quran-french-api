import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetAyahBySurahIdentifierParamsDto {
  @ApiProperty({
    description:
      'Surah number or normalized surah name. Examples: 2, al-baqara, ya-sin.',
    example: 'al-baqara',
  })
  @IsString()
  @IsNotEmpty()
  surahIdentifier!: string;

  @ApiProperty({
    description:
      'Verse key from the dataset. 0 is the surah title, 0,5 is the Bismillah row, and some rare dataset-specific composite keys also exist.',
    example: '255',
  })
  @IsString()
  @IsNotEmpty()
  ayahNumber!: string;
}
