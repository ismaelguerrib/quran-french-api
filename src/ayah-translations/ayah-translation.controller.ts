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
  @ApiOkResponse({
    description: 'Paginated ayah translations',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              ayahId: { type: 'integer', example: 1 },
              translationSourceId: { type: 'integer', example: 1 },
              text: { type: 'string', example: 'Sample translation text' },
            },
            required: ['id', 'ayahId', 'translationSourceId', 'text'],
          },
        },
        meta: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            pageSize: { type: 'integer', example: 20 },
            total: { type: 'integer', example: 14 },
          },
          required: ['page', 'pageSize', 'total'],
        },
      },
      required: ['data', 'meta'],
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid pagination query params' })
  findAll(
    @Query('page') pageParam?: string,
    @Query('pageSize') pageSizeParam?: string,
  ) {
    const page = this.parsePositiveInt(pageParam, 'page', 1);
    const pageSize = this.parsePositiveInt(pageSizeParam, 'pageSize', 20);

    return this.ayahTranslationService.findAll(page, Math.min(pageSize, 100));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one ayah translation by id' })
  @ApiParam({
    name: 'id',
    description: 'Ayah translation id (>= 1)',
    schema: { type: 'integer', minimum: 1 },
  })
  @ApiOkResponse({
    description: 'Ayah translation detail',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            ayahId: { type: 'integer', example: 1 },
            translationSourceId: { type: 'integer', example: 1 },
            text: { type: 'string', example: 'Sample translation text' },
          },
          required: ['id', 'ayahId', 'translationSourceId', 'text'],
        },
      },
      required: ['data'],
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid id path parameter' })
  @ApiNotFoundResponse({ description: 'Ayah translation not found' })
  findOne(@Param('id') id: string) {
    return this.ayahTranslationService.findOne(this.parsePositiveInt(id, 'id'));
  }

  private parsePositiveInt(
    value: string | undefined,
    label: string,
    fallback?: number,
  ): number {
    if (!value) {
      if (fallback !== undefined) {
        return fallback;
      }
      throw new BadRequestException(`${label} must be a positive integer`);
    }

    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new BadRequestException(`${label} must be a positive integer`);
    }

    return parsed;
  }
}
