import { ApiProperty } from '@nestjs/swagger';
import { AyahResponseDto } from './ayah-response.dto';
import { SurahAyahListMetaDto } from './surah-ayah-list-meta.dto';

export class SurahAyahListResponseDto {
  @ApiProperty({ type: AyahResponseDto, isArray: true })
  data!: AyahResponseDto[];

  @ApiProperty({ type: SurahAyahListMetaDto })
  meta!: SurahAyahListMetaDto;
}
