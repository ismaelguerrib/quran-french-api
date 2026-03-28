import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AyahTranslationQueryDto } from './dto/ayah-translation.query.dto';
import { AyahTranslationListResponseDto } from './dto/ayah-translation-list-response.dto';
import { AyahTranslationResponseDto } from './dto/ayah-translation-response.dto';
import { AyahTranslationService } from './ayah-translation.service';

@ApiTags('Ayah Translations')
@Controller('ayah-translations')
export class AyahTranslationController {
  constructor(
    private readonly ayahTranslationService: AyahTranslationService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List ayah translations (paginated)' })
  @ApiQuery({
    name: 'page',
    required: false,
    schema: { type: 'integer', minimum: 1, default: 1 },
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
  })
  @ApiQuery({
    name: 'surahNumber',
    required: false,
    schema: { type: 'integer', minimum: 1 },
  })
  @ApiQuery({
    name: 'ayahNumber',
    required: false,
    schema: {
      type: 'string',
      example: '1',
      description:
        'Verse key from the dataset. 0 is the surah title and 0,5 is the Bismillah row.',
    },
  })
  @ApiQuery({
    name: 'source',
    required: false,
    schema: { type: 'string', example: 'hamidullah-fr' },
  })
  @ApiOkResponse({
    description: 'Paginated ayah translations',
    type: AyahTranslationListResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid pagination or filtering query parameters.',
  })
  findAll(
    @Query() query: AyahTranslationQueryDto,
  ): Promise<AyahTranslationListResponseDto> {
    return this.ayahTranslationService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one ayah translation by id' })
  @ApiParam({
    name: 'id',
    description: 'Ayah translation identifier.',
    schema: { type: 'integer', minimum: 1 },
  })
  @ApiOkResponse({
    description: 'Ayah translation detail',
    type: AyahTranslationResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid translation identifier.',
  })
  @ApiNotFoundResponse({ description: 'Ayah translation not found' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AyahTranslationResponseDto> {
    return this.ayahTranslationService.findOne(id);
  }
}
