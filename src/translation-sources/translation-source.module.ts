import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranslationSourceEntity } from './entities/translation-source.entity';
import { TranslationSourceService } from './translation-source.service';
import { TranslationSourceController } from './translation-source.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TranslationSourceEntity])],
  controllers: [TranslationSourceController],
  providers: [TranslationSourceService],
})
export class TranslationSourceModule {}
