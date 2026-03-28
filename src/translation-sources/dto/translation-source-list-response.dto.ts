import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto';
import { TranslationSourceDto } from './translation-source.dto';

export class TranslationSourceListResponseDto {
  @ApiProperty({ type: TranslationSourceDto, isArray: true })
  data!: TranslationSourceDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}
