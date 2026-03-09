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
import { TranslationSourceService } from './translation-source.service';

const ALLOWED_SORT_BY = new Set(['id', 'code', 'label', 'language']);
const ALLOWED_SORT_DIR = new Set(['asc', 'desc']);

@ApiTags('Translation Sources')
@Controller('translation-source')
export class TranslationSourceController {
  constructor(
    private readonly translationSourceService: TranslationSourceService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'List translation sources (paginated and sortable)',
  })
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
    name: 'sortBy',
    required: false,
    schema: {
      type: 'string',
      enum: ['id', 'code', 'label', 'language'],
      default: 'code',
    },
  })
  @ApiQuery({
    name: 'sortDir',
    required: false,
    schema: {
      type: 'string',
      enum: ['asc', 'desc'],
      default: 'asc',
    },
  })
  @ApiOkResponse({
    description: 'Paginated translation sources',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              code: { type: 'string', example: 'hamidullah-fr' },
              label: {
                type: 'string',
                nullable: true,
                example: 'Muhammad Hamidullah',
              },
              language: { type: 'string', nullable: true, example: 'fr' },
            },
            required: ['id', 'code', 'label', 'language'],
          },
        },
        meta: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            pageSize: { type: 'integer', example: 20 },
            total: { type: 'integer', example: 2 },
          },
          required: ['page', 'pageSize', 'total'],
        },
      },
      required: ['data', 'meta'],
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid pagination or sorting query parameters',
  })
  findAll(
    @Query('page') pageParam?: string,
    @Query('pageSize') pageSizeParam?: string,
    @Query('sortBy') sortByParam?: string,
    @Query('sortDir') sortDirParam?: string,
  ) {
    const page = this.parsePositiveInt(pageParam, 'page', 1);
    const pageSize = this.parsePositiveInt(pageSizeParam, 'pageSize', 20);
    const sortBy = this.parseSortBy(sortByParam);
    const sortDir = this.parseSortDir(sortDirParam);

    return this.translationSourceService.findAll(
      page,
      Math.min(pageSize, 100),
      sortBy,
      sortDir,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one translation source by id' })
  @ApiParam({
    name: 'id',
    description: 'Translation source id (>= 1)',
    schema: { type: 'integer', minimum: 1 },
  })
  @ApiOkResponse({
    description: 'Translation source detail',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            code: { type: 'string', example: 'hamidullah-fr' },
            label: {
              type: 'string',
              nullable: true,
              example: 'Muhammad Hamidullah',
            },
            language: { type: 'string', nullable: true, example: 'fr' },
          },
          required: ['id', 'code', 'label', 'language'],
        },
      },
      required: ['data'],
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid id path parameter' })
  @ApiNotFoundResponse({ description: 'Translation source not found' })
  findOne(@Param('id') id: string) {
    return this.translationSourceService.findOne(
      this.parsePositiveInt(id, 'id'),
    );
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

  private parseSortBy(
    value: string | undefined,
  ): 'id' | 'code' | 'label' | 'language' {
    if (!value) {
      return 'code';
    }

    if (!ALLOWED_SORT_BY.has(value)) {
      throw new BadRequestException(
        'sortBy must be one of: id, code, label, language',
      );
    }

    return value as 'id' | 'code' | 'label' | 'language';
  }

  private parseSortDir(value: string | undefined): 'asc' | 'desc' {
    if (!value) {
      return 'asc';
    }

    const normalized = value.toLowerCase();
    if (!ALLOWED_SORT_DIR.has(normalized)) {
      throw new BadRequestException('sortDir must be one of: asc, desc');
    }

    return normalized as 'asc' | 'desc';
  }
}
