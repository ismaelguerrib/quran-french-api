import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ListSurahAyahsParamsDto {
  @ApiProperty({
    description:
      'Surah number or normalized surah name. Examples: 2, al-baqara, ya-sin.',
    example: 'al-baqara',
  })
  @IsString()
  @IsNotEmpty()
  surahIdentifier!: string;
}
