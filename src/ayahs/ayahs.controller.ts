import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AyahService } from './ayahs.service';

@ApiTags('Ayahs')
@Controller('ayahs')
export class AyahController {
  constructor(private readonly ayahService: AyahService) {}

  @Get(':surahNumber/:ayahNumber')
  @ApiOperation({
    summary: 'Get translations for one ayah and selected sources',
  })
  @ApiParam({
    name: 'surahNumber',
    description: 'Surah number (>= 1)',
    schema: { type: 'integer', minimum: 1 },
  })
  @ApiParam({
    name: 'ayahNumber',
    description: 'Ayah number (>= 1)',
    schema: { type: 'integer', minimum: 1 },
  })
  @ApiQuery({
    name: 'source',
    required: true,
    description:
      'Comma-separated source codes (example: hamidullah-fr,masson-fr)',
    schema: { type: 'string' },
  })
  @ApiOkResponse({
    description: 'Ayah with selected translations',
    schema: {
      type: 'object',
      properties: {
        surahNumber: { type: 'integer', example: 1 },
        ayahNumber: { type: 'integer', example: 1 },
        translations: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              source: { type: 'string', example: 'hamidullah-fr' },
              author: {
                type: 'string',
                nullable: true,
                example: 'Muhammad Hamidullah',
              },
              text: {
                type: 'string',
                nullable: true,
                example:
                  "[Test] Al-Fatiha 1:1 - Au nom d'Allah, le Tout Misericordieux, le Tres Misericordieux.",
              },
            },
            required: ['source', 'author', 'text'],
          },
        },
      },
      required: ['surahNumber', 'ayahNumber', 'translations'],
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid path params format' })
  @ApiNotFoundResponse({
    description: 'Ayah not found or no source query parameter provided',
  })
  async getAyah(
    @Param('surahNumber') surahNumberParam: string,
    @Param('ayahNumber') ayahNumberParam: string,
    @Query('source') source: string,
  ) {
    const surahNumber = this.parsePositiveInt(surahNumberParam, 'surahNumber');
    const ayahNumber = this.parsePositiveInt(ayahNumberParam, 'ayahNumber');

    return this.ayahService.getAyah(
      surahNumber,
      ayahNumber,
      this.parseSources(source),
    );
  }

  private parsePositiveInt(value: string, label: string): number {
    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new BadRequestException(`${label} must be a positive integer`);
    }

    return parsed;
  }

  private parseSources(source: string): string[] {
    if (!source) {
      return [];
    }

    return [
      ...new Set(
        source
          .split(',')
          .map((slug) => slug.trim())
          .filter(Boolean),
      ),
    ];
  }
}
