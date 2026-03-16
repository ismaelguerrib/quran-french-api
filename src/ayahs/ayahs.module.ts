import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AyahTranslationEntity } from '../ayah-translations/entities/ayah-translation.entity';
import { TranslationSourceEntity } from '../translation-sources/entities/translation-source.entity';
import { AyahEntity } from './entities/ayah.entity';
import { AyahController } from './ayahs.controller';
import { AyahService } from './ayahs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AyahEntity,
      AyahTranslationEntity,
      TranslationSourceEntity,
    ]),
  ],
  controllers: [AyahController],
  providers: [AyahService],
})
export class AyahModule {}
