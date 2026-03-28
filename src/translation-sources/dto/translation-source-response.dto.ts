import { ApiProperty } from '@nestjs/swagger';
import { TranslationSourceDto } from './translation-source.dto';

export class TranslationSourceResponseDto {
  @ApiProperty({ type: TranslationSourceDto })
  data!: TranslationSourceDto;
}
