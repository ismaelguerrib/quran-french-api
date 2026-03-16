import { ApiProperty } from '@nestjs/swagger';
import { AyahTranslationPayloadDto } from './ayah-translation-payload.dto';

export class AyahTranslationDetailResponseDto {
  @ApiProperty({ type: AyahTranslationPayloadDto })
  data!: AyahTranslationPayloadDto;
}
