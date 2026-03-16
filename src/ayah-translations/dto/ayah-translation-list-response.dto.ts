import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto';
import { AyahTranslationPayloadDto } from './ayah-translation-payload.dto';

export class AyahTranslationListResponseDto {
  @ApiProperty({ type: AyahTranslationPayloadDto, isArray: true })
  data!: AyahTranslationPayloadDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}
