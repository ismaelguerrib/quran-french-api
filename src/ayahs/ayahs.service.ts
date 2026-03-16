import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AyahTranslationEntity } from '../ayah-translations/entities/ayah-translation.entity';
import { TranslationSourceEntity } from '../translation-sources/entities/translation-source.entity';
import { AyahResponseDto } from './dto/ayah-response.dto';
import { AyahEntity } from './entities/ayah.entity';

@Injectable()
export class AyahService {
  constructor(
    @InjectRepository(AyahEntity)
    private readonly ayahRepository: Repository<AyahEntity>,
    @InjectRepository(TranslationSourceEntity)
    private readonly translationSourceRepository: Repository<TranslationSourceEntity>,
    @InjectRepository(AyahTranslationEntity)
    private readonly ayahTranslationRepository: Repository<AyahTranslationEntity>,
  ) {}

  async getAyah(
    surahNumber: number,
    verseKey: string,
    requestedSourceCodes?: string[],
  ): Promise<AyahResponseDto> {
    const ayah = await this.ayahRepository.findOne({
      where: { surahNumber, verseKey },
    });

    if (!ayah) {
      throw new NotFoundException(
        `Verse ${surahNumber}:${verseKey} was not found.`,
      );
    }

    const sources = requestedSourceCodes
      ? await this.translationSourceRepository.find({
          where: { code: In(requestedSourceCodes) },
        })
      : await this.translationSourceRepository.find({
          order: {
            chronologicalOrder: 'ASC',
            code: 'ASC',
          },
        });

    const sourcesByCode = new Map(
      sources.map((source) => [source.code, source]),
    );
    const sourceIds = sources.map((source) => source.id);

    const translations =
      sourceIds.length > 0
        ? await this.ayahTranslationRepository.find({
            where: {
              ayahId: ayah.id,
              translationSourceId: In(sourceIds),
            },
          })
        : [];

    const translationBySourceId = new Map(
      translations.map((translation) => [
        translation.translationSourceId,
        translation,
      ]),
    );

    const orderedSourceCodes =
      requestedSourceCodes && requestedSourceCodes.length > 0
        ? requestedSourceCodes
        : sources.map((source) => source.code);

    return {
      surahNumber,
      verseKey: ayah.verseKey,
      verseNumber: ayah.verseNumber,
      translations: orderedSourceCodes.map((sourceCode) => {
        const source = sourcesByCode.get(sourceCode);
        const translation = source
          ? translationBySourceId.get(source.id)
          : undefined;

        return {
          source: sourceCode,
          author: source?.label ?? null,
          text: translation?.text ?? null,
          wordCount: translation?.wordCount ?? null,
        };
      }),
    };
  }
}
