import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AyahTranslationPayloadDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  ayahId!: number;

  @ApiProperty({ example: 1 })
  translationSourceId!: number;

  @ApiProperty({ example: 2 })
  surahNumber!: number;

  @ApiProperty({
    example: '255',
    description:
      'Exact verse key from the dataset. 0 is the surah title and 0,5 is the Bismillah row.',
  })
  verseKey!: string;

  @ApiPropertyOptional({ example: 255, nullable: true })
  verseNumber!: number | null;

  @ApiProperty({ example: 'hamidullah-fr' })
  source!: string;

  @ApiPropertyOptional({ example: 'Hamidullah', nullable: true })
  author!: string | null;

  @ApiProperty({ example: '1Hamidullah1' })
  reference!: string;

  @ApiPropertyOptional({
    example: 'Au nom d’Allah, le Tout Miséricordieux, le Très Miséricordieux.',
    nullable: true,
  })
  text!: string | null;

  @ApiPropertyOptional({ example: 5, nullable: true })
  wordCount!: number | null;
}
