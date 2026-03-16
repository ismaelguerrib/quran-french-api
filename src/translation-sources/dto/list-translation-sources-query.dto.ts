import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export const TRANSLATION_SOURCE_SORT_FIELDS = [
  'id',
  'code',
  'label',
  'language',
  'chronologicalOrder',
] as const;

export type TranslationSourceSortField =
  (typeof TRANSLATION_SOURCE_SORT_FIELDS)[number];

export class ListTranslationSourcesQueryDto {
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
    enum: TRANSLATION_SOURCE_SORT_FIELDS,
    default: 'chronologicalOrder',
  })
  @IsIn(TRANSLATION_SOURCE_SORT_FIELDS)
  sortBy: TranslationSourceSortField = 'chronologicalOrder';

  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
    default: 'asc',
  })
  @IsIn(['asc', 'desc'])
  sortDir: 'asc' | 'desc' = 'asc';

  @ApiPropertyOptional({
    description: 'Optional language filter such as fr, ar or ar-Latn.',
    example: 'fr',
  })
  @IsOptional()
  @IsString()
  language?: string;
}
