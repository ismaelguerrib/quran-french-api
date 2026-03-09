import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { TranslationSourceService } from './translation-source.service';

const ALLOWED_SORT_BY = new Set(['id', 'code', 'label', 'language']);
const ALLOWED_SORT_DIR = new Set(['asc', 'desc']);

@Controller('translation-source')
export class TranslationSourceController {
  constructor(
    private readonly translationSourceService: TranslationSourceService,
  ) {}

  @Get()
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
