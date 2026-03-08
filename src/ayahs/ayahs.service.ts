import { Injectable, NotFoundException } from '@nestjs/common';

export interface Ayah {
  surahNumber: number;
  ayahNumber: number;
  source: string;
  translation: string;
}

@Injectable()
export class AyahService {
  getAyah(
    surahNumber: number,
    ayahNumber: number,
    sourceSlugs: string[],
  ): Ayah {
    if (sourceSlugs.length === 0) {
      throw new NotFoundException(
        'No translation source provided. Use ?source=hamidullah-fr,masson-fr',
      );
    }

    return {
      surahNumber,
      ayahNumber,
      source: sourceSlugs.join(','),
      translation: 'Test translation text',
    };
  }
}
