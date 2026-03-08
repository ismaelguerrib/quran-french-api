import { Get, Param } from '@nestjs/common';
import { AyahTranslationService } from './ayah-translation.service';

export class AyahTranslationController {
  constructor(
    private readonly ayahTranslationService: AyahTranslationService,
  ) {}

  @Get()
  findAll() {
    return this.ayahTranslationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ayahTranslationService.findOne(+id);
  }
}
