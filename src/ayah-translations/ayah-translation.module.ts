import { Module } from '@nestjs/common';
import { AyahTranslationService } from './ayah-translation.service';
import { AyahTranslationController } from './ayah-translation.controller';

@Module({
  controllers: [AyahTranslationController],
  providers: [AyahTranslationService],
})
export class AyahTranslationModule {}
