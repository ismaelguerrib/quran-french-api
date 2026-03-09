import {
  Injectable,
  NotFoundException,
  Optional,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, type FindOptionsOrder, type Repository } from 'typeorm';
import { TranslationSourceEntity } from './entities/translation-source.entity';

type TranslationSourceSortBy = 'id' | 'code' | 'label' | 'language';
type TranslationSourceSortDir = 'asc' | 'desc';

export interface TranslationSourcePayload {
  id: number;
  code: string;
  label: string | null;
  language: string | null;
}

export interface TranslationSourceListResponse {
  data: TranslationSourcePayload[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface TranslationSourceDetailResponse {
  data: TranslationSourcePayload;
}

@Injectable()
export class TranslationSourceService {
  constructor(
    @Optional()
    @InjectDataSource()
    private readonly dataSource?: DataSource,
  ) {}

  async findAll(
    page: number,
    pageSize: number,
    sortBy: TranslationSourceSortBy,
    sortDir: TranslationSourceSortDir,
  ): Promise<TranslationSourceListResponse> {
    const repository = this.getRepository();
    const orderDirection = sortDir === 'asc' ? 'ASC' : 'DESC';
    const [rows, total] = await repository.findAndCount({
      order: {
        [sortBy]: orderDirection,
      } as FindOptionsOrder<TranslationSourceEntity>,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      data: rows.map((row) => this.toPayload(row)),
      meta: {
        page,
        pageSize,
        total,
      },
    };
  }

  async findOne(id: number): Promise<TranslationSourceDetailResponse> {
    const repository = this.getRepository();
    const row = await repository.findOne({ where: { id } });

    if (!row) {
      throw new NotFoundException(
        `Translation source with id ${id} was not found.`,
      );
    }

    return { data: this.toPayload(row) };
  }

  private toPayload(row: TranslationSourceEntity): TranslationSourcePayload {
    return {
      id: row.id,
      code: row.code,
      label: row.label ?? null,
      language: row.language ?? null,
    };
  }

  private getRepository(): Repository<TranslationSourceEntity> {
    if (!this.dataSource) {
      throw new ServiceUnavailableException(
        'Database connection is not configured.',
      );
    }

    return this.dataSource.getRepository(TranslationSourceEntity);
  }
}
