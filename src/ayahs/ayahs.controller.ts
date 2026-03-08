import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { AyahService } from './ayahs.service';

@Controller('ayahs')
export class AyahController {
  constructor(private readonly ayahService: AyahService) {}

  @Get(':surahNumber/:ayahNumber')
  getAyah(
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
