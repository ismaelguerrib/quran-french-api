import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AyahTranslationQueryDto } from './dto/ayah-translation.query.dto';
import { AyahTranslationListResponseDto } from './dto/ayah-translation-list-response.dto';
import { AyahTranslationResponseDto } from './dto/ayah-translation-response.dto';
import { AyahTranslationDto } from './dto/ayah-translation.dto';
import { AyahTranslationEntity } from './entities/ayah-translation.entity';

@Injectable()
export class AyahTranslationService {
  constructor(
    @InjectRepository(AyahTranslationEntity)
    private readonly ayahTranslationRepository: Repository<AyahTranslationEntity>,
  ) {}

  async findAll(
    query: AyahTranslationQueryDto,
  ): Promise<AyahTranslationListResponseDto> {
    const queryBuilder =
      this.ayahTranslationRepository.createQueryBuilder('ayahTranslation');

    queryBuilder.leftJoinAndSelect('ayahTranslation.ayah', 'ayah');
    queryBuilder.leftJoinAndSelect(
      'ayahTranslation.translationSource',
      'translationSource',
    );

    if (query.surahNumber) {
      queryBuilder.andWhere('ayah.surahNumber = :surahNumber', {
        surahNumber: query.surahNumber,
      });
    }

    if (query.ayahNumber) {
      queryBuilder.andWhere('ayah.verseKey = :verseKey', {
        verseKey: query.ayahNumber,
      });
    }

    if (query.source) {
      queryBuilder.andWhere('translationSource.code = :sourceCode', {
        sourceCode: query.source,
      });
    }

    queryBuilder.orderBy('ayah.surahNumber', 'ASC');
    queryBuilder.addOrderBy('ayah.verseNumber', 'ASC', 'NULLS LAST');
    queryBuilder.addOrderBy('ayah.verseKey', 'ASC');
    queryBuilder.addOrderBy(
      'translationSource.chronologicalOrder',
      'ASC',
      'NULLS LAST',
    );
    queryBuilder.addOrderBy('translationSource.code', 'ASC');
    queryBuilder.skip((query.page - 1) * query.pageSize);
    queryBuilder.take(query.pageSize);

    const [rows, total] = await queryBuilder.getManyAndCount();

    return {
      data: rows.map((row) => this.toPayload(row)),
      meta: {
        page: query.page,
        pageSize: query.pageSize,
        total,
      },
    };
  }

  async findOne(id: number): Promise<AyahTranslationResponseDto> {
    const row = await this.ayahTranslationRepository.findOne({
      where: { id },
      relations: {
        ayah: true,
        translationSource: true,
      },
    });

    if (!row) {
      throw new NotFoundException(
        `Ayah translation with id ${id} was not found.`,
      );
    }

    return { data: this.toPayload(row) };
  }

  private toPayload(row: AyahTranslationEntity): AyahTranslationDto {
    return {
      id: row.id,
      ayahId: row.ayahId,
      translationSourceId: row.translationSourceId,
      surahNumber: row.ayah.surahNumber,
      verseKey: row.ayah.verseKey,
      verseNumber: row.ayah.verseNumber,
      source: row.translationSource.code,
      author: row.translationSource.label ?? null,
      reference: row.reference,
      text: row.text,
      wordCount: row.wordCount,
    };
  }
}
