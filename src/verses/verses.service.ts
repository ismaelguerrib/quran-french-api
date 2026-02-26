import { Injectable, NotFoundException } from '@nestjs/common';

export interface VerseTranslation {
  source: string;
  author: string;
  text: string;
}

export interface VerseResponse {
  surahNumber: number;
  ayahNumber: number;
  translations: VerseTranslation[];
}

@Injectable()
export class VersesService {
  getVerse(
    surahNumber: number,
    ayahNumber: number,
    sourceSlugs: string[],
  ): VerseResponse {
    if (sourceSlugs.length === 0) {
      throw new NotFoundException(
        'No translation source provided. Use ?source=hamidullah-fr,masson-fr',
      );
    }

    return {
      surahNumber,
      ayahNumber,
      translations: sourceSlugs.map((source) => ({
        source,
        author: 'Test Author',
        text: 'Test translation text',
      })),
    };
  }
}
