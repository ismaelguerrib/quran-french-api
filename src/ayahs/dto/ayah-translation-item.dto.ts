import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AyahTranslationItemDto {
  @ApiProperty({ example: 'hamidullah' })
  source!: string;

  @ApiPropertyOptional({
    example: 'Hamidullah',
    nullable: true,
  })
  author!: string | null;

  @ApiPropertyOptional({
    example: 'Au nom d’Allah, le Tout Miséricordieux, le Très Miséricordieux.',
    nullable: true,
  })
  text!: string | null;

  @ApiPropertyOptional({ example: 5, nullable: true })
  wordCount!: number | null;
}
