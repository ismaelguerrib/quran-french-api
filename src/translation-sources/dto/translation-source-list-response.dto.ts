import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto';
import { TranslationSourcePayloadDto } from './translation-source-payload.dto';

export class TranslationSourceListResponseDto {
  @ApiProperty({ type: TranslationSourcePayloadDto, isArray: true })
  data!: TranslationSourcePayloadDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}
