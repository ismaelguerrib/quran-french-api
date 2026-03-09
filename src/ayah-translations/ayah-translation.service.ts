import {
  Injectable,
  NotFoundException,
  Optional,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, type Repository } from 'typeorm';
import { AyahTranslationEntity } from './entities/ayah-translation.entity';

export interface AyahTranslationPayload {
  id: number;
  ayahId: number;
  translationSourceId: number;
  text: string;
}

export interface AyahTranslationListResponse {
  data: AyahTranslationPayload[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface AyahTranslationDetailResponse {
  data: AyahTranslationPayload;
}

@Injectable()
export class AyahTranslationService {
  constructor(
    @Optional()
    @InjectDataSource()
    private readonly dataSource?: DataSource,
  ) {}

  async findAll(
    page: number,
    pageSize: number,
  ): Promise<AyahTranslationListResponse> {
    const repository = this.getRepository();
    const [rows, total] = await repository.findAndCount({
      order: { id: 'ASC' },
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

  async findOne(id: number): Promise<AyahTranslationDetailResponse> {
    const repository = this.getRepository();
    const row = await repository.findOne({ where: { id } });

    if (!row) {
      throw new NotFoundException(
        `Ayah translation with id ${id} was not found.`,
      );
    }

    return { data: this.toPayload(row) };
  }

  private toPayload(row: AyahTranslationEntity): AyahTranslationPayload {
    return {
      id: row.id,
      ayahId: row.ayahId,
      translationSourceId: row.translationSourceId,
      text: row.text,
    };
  }

  private getRepository(): Repository<AyahTranslationEntity> {
    if (!this.dataSource) {
      throw new ServiceUnavailableException(
        'Database connection is not configured.',
      );
    }

    return this.dataSource.getRepository(AyahTranslationEntity);
  }
}
