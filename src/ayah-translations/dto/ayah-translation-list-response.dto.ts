import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto';
import { AyahTranslationDto } from './ayah-translation.dto';

export class AyahTranslationListResponseDto {
  @ApiProperty({ type: AyahTranslationDto, isArray: true })
  data!: AyahTranslationDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}
