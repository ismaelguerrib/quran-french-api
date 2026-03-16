import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AyahTranslationItemDto } from './ayah-translation-item.dto';

export class AyahResponseDto {
  @ApiProperty({ example: 1 })
  surahNumber!: number;

  @ApiProperty({
    description: 'Exact verse key as stored in the dataset.',
    example: '1',
  })
  verseKey!: string;

  @ApiPropertyOptional({
    description:
      'Numeric verse number when the dataset key is a plain integer. Null for special metadata keys such as 0, 0,5, or composite keys.',
    example: 1,
    nullable: true,
  })
  verseNumber!: number | null;

  @ApiProperty({
    type: AyahTranslationItemDto,
    isArray: true,
  })
  translations!: AyahTranslationItemDto[];
}
