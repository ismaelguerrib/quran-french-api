import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  TranslationSourceQueryDto,
  type TranslationSourceSortField,
} from './dto/translation-source.query.dto';
import { TranslationSourceListResponseDto } from './dto/translation-source-list-response.dto';
import { TranslationSourceResponseDto } from './dto/translation-source-response.dto';
import { TranslationSourceDto } from './dto/translation-source.dto';
import { TranslationSourceEntity } from './entities/translation-source.entity';

@Injectable()
export class TranslationSourceService {
  constructor(
    @InjectRepository(TranslationSourceEntity)
    private readonly translationSourceRepository: Repository<TranslationSourceEntity>,
  ) {}

  async findAll(
    query: TranslationSourceQueryDto,
  ): Promise<TranslationSourceListResponseDto> {
    const queryBuilder =
      this.translationSourceRepository.createQueryBuilder('translationSource');

    if (query.language) {
      queryBuilder.where('translationSource.language = :language', {
        language: query.language,
      });
    }

    queryBuilder.orderBy(
      this.resolveSortField(query.sortBy),
      query.sortDir.toUpperCase() as 'ASC' | 'DESC',
      'NULLS LAST',
    );
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

  async findOne(id: number): Promise<TranslationSourceResponseDto> {
    const row = await this.translationSourceRepository.findOne({
      where: { id },
    });

    if (!row) {
      throw new NotFoundException(
        `Translation source with id ${id} was not found.`,
      );
    }

    return { data: this.toPayload(row) };
  }

  private toPayload(row: TranslationSourceEntity): TranslationSourceDto {
    return {
      id: row.id,
      code: row.code,
      label: row.label ?? null,
      language: row.language ?? null,
      chronologicalOrder: row.chronologicalOrder ?? null,
    };
  }

  private resolveSortField(sortField: TranslationSourceSortField): string {
    const sortFieldMap: Record<TranslationSourceSortField, string> = {
      id: 'translationSource.id',
      code: 'translationSource.code',
      label: 'translationSource.label',
      language: 'translationSource.language',
      chronologicalOrder: 'translationSource.chronologicalOrder',
    };

    return sortFieldMap[sortField];
  }
}
