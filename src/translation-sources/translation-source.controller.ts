import { Controller, Get, Param } from '@nestjs/common';
import { TranslationSourceService } from './translation-source.service';

@Controller('translation-source')
export class TranslationSourceController {
  constructor(
    private readonly translationSourceService: TranslationSourceService,
  ) {}

  @Get()
  findAll() {
    return this.translationSourceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.translationSourceService.findOne(+id);
  }
}
