import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

function parseSourceQuery(value: unknown): string[] | undefined {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return undefined;
  }

  const sourceCodes = [
    ...new Set(
      value
        .split(',')
        .map((sourceCode) => sourceCode.trim())
        .filter(Boolean),
    ),
  ];

  return sourceCodes.length > 0 ? sourceCodes : undefined;
}

export class GetAyahQueryDto {
  @ApiPropertyOptional({
    name: 'source',
    description:
      'Optional comma-separated source codes. When omitted, the API returns all available sources for the verse.',
    example: 'hamidullah,boubakeur',
  })
  @IsOptional()
  @Transform(({ value }) => parseSourceQuery(value))
  @IsArray()
  @IsString({ each: true })
  source?: string[];
}
