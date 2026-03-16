import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AyahTranslationEntity } from './entities/ayah-translation.entity';
import { AyahTranslationService } from './ayah-translation.service';
import { AyahTranslationController } from './ayah-translation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AyahTranslationEntity])],
  controllers: [AyahTranslationController],
  providers: [AyahTranslationService],
})
export class AyahTranslationModule {}
