import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { AyahTranslationService } from './ayah-translation.service';

@Controller('ayah-translations')
export class AyahTranslationController {
  constructor(
    private readonly ayahTranslationService: AyahTranslationService,
  ) {}

  @Get()
  findAll(
    @Query('page') pageParam?: string,
    @Query('pageSize') pageSizeParam?: string,
  ) {
    const page = this.parsePositiveInt(pageParam, 'page', 1);
    const pageSize = this.parsePositiveInt(pageSizeParam, 'pageSize', 20);

    return this.ayahTranslationService.findAll(page, Math.min(pageSize, 100));
  }

  @Get(':id')
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
