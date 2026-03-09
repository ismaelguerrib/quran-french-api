import {
  Injectable,
  NotFoundException,
  Optional,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, In, type Repository } from 'typeorm';
import { AyahTranslationEntity } from '../ayah-translations/entities/ayah-translation.entity';
import { TranslationSourceEntity } from '../translation-sources/entities/translation-source.entity';
import { AyahEntity } from './entities/ayah.entity';

interface AyahTranslationItem {
  source: string;
  author: string | null;
  text: string | null;
}

export interface Ayah {
  surahNumber: number;
  ayahNumber: number;
  translations: AyahTranslationItem[];
}

@Injectable()
export class AyahService {
  constructor(
    @Optional()
    @InjectDataSource()
    private readonly dataSource?: DataSource,
  ) {}

  async getAyah(
    surahNumber: number,
    ayahNumber: number,
    sourceSlugs: string[],
  ): Promise<Ayah> {
    if (sourceSlugs.length === 0) {
      throw new NotFoundException(
        'No translation source provided. Use ?source=hamidullah-fr,masson-fr',
      );
    }

    const ayahRepository = this.getRepository(AyahEntity);
    const translationSourceRepository = this.getRepository(
      TranslationSourceEntity,
    );
    const ayahTranslationRepository = this.getRepository(AyahTranslationEntity);

    const ayah = await ayahRepository.findOne({
      where: { surahNumber, ayahNumber },
    });

    if (!ayah) {
      throw new NotFoundException(
        `Ayah ${surahNumber}:${ayahNumber} was not found.`,
      );
    }

    const sources = await translationSourceRepository.find({
      where: { code: In(sourceSlugs) },
    });
    const sourcesByCode = new Map(
      sources.map((source) => [source.code, source]),
    );
    const sourceIds = sources.map((source) => source.id);

    const translations =
      sourceIds.length > 0
        ? await ayahTranslationRepository.find({
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

    return {
      surahNumber,
      ayahNumber,
      translations: sourceSlugs.map((sourceSlug) => {
        const source = sourcesByCode.get(sourceSlug);
        const translation = source
          ? translationBySourceId.get(source.id)
          : undefined;

        return {
          source: sourceSlug,
          author: source?.label ?? null,
          text: translation?.text ?? null,
        };
      }),
    };
  }

  private getRepository<T extends object>(entity: new () => T): Repository<T> {
    if (!this.dataSource) {
      throw new ServiceUnavailableException(
        'Database connection is not configured.',
      );
    }

    return this.dataSource.getRepository(entity);
  }
}
