import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListAyahTranslationsQueryDto {
  @ApiPropertyOptional({ example: 1, default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ example: 20, default: 20, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize = 20;

  @ApiPropertyOptional({
    description: 'Optional surah number filter.',
    example: 72,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  surahNumber?: number;

  @ApiPropertyOptional({
    description:
      'Optional verse key filter. 0 is the surah title and 0,5 is the Bismillah row in the dataset.',
    example: '1',
  })
  @IsOptional()
  @IsString()
  ayahNumber?: string;

  @ApiPropertyOptional({
    description: 'Optional translation source code filter.',
    example: 'hamidullah-fr',
  })
  @IsOptional()
  @IsString()
  source?: string;
}
