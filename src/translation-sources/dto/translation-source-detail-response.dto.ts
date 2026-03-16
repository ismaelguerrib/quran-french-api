import { ApiProperty } from '@nestjs/swagger';
import { TranslationSourcePayloadDto } from './translation-source-payload.dto';

export class TranslationSourceDetailResponseDto {
  @ApiProperty({ type: TranslationSourcePayloadDto })
  data!: TranslationSourcePayloadDto;
}
