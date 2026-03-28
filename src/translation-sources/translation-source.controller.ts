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
import { TranslationSourceQueryDto } from './dto/translation-source.query.dto';
import { TranslationSourceListResponseDto } from './dto/translation-source-list-response.dto';
import { TranslationSourceResponseDto } from './dto/translation-source-response.dto';
import { TranslationSourceService } from './translation-source.service';

@ApiTags('Translation Sources')
@Controller(['translation-sources', 'translation-source'])
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
      enum: ['id', 'code', 'label', 'language', 'chronologicalOrder'],
      default: 'chronologicalOrder',
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
  @ApiQuery({
    name: 'language',
    required: false,
    schema: { type: 'string', example: 'fr' },
  })
  @ApiOkResponse({
    description: 'Paginated translation sources',
    type: TranslationSourceListResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid pagination, sorting, or filtering parameters.',
  })
  findAll(
    @Query() query: TranslationSourceQueryDto,
  ): Promise<TranslationSourceListResponseDto> {
    return this.translationSourceService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one translation source by id' })
  @ApiParam({
    name: 'id',
    description: 'Translation source identifier.',
    schema: { type: 'integer', minimum: 1 },
  })
  @ApiOkResponse({
    description: 'Translation source detail',
    type: TranslationSourceResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid translation source identifier.',
  })
  @ApiNotFoundResponse({ description: 'Translation source not found' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TranslationSourceResponseDto> {
    return this.translationSourceService.findOne(id);
  }
}
