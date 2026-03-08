import { Module } from '@nestjs/common';
import { TranslationSourceService } from './translation-source.service';
import { TranslationSourceController } from './translation-source.controller';

@Module({
  controllers: [TranslationSourceController],
  providers: [TranslationSourceService],
})
export class TranslationSourceModule {}
