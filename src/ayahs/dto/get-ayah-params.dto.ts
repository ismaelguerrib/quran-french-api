import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetAyahParamsDto {
  @ApiProperty({
    description: 'Surah number from the dataset.',
    example: 2,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  surahNumber!: number;

  @ApiProperty({
    description:
      'Verse key from the dataset. 0 is the surah title, 0,5 is the Bismillah row, and some rare dataset-specific composite keys also exist.',
    example: '255',
  })
  @IsString()
  @IsNotEmpty()
  ayahNumber!: string;
}
