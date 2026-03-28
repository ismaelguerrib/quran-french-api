import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TranslationSourceDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'hamidullah' })
  code!: string;

  @ApiPropertyOptional({
    example: 'Hamidullah',
    nullable: true,
  })
  label!: string | null;

  @ApiPropertyOptional({
    example: 'fr',
    nullable: true,
  })
  language!: string | null;

  @ApiPropertyOptional({
    example: 9,
    nullable: true,
  })
  chronologicalOrder!: number | null;
}
