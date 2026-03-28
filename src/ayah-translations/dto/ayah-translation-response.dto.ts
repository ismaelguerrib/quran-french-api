import { ApiProperty } from '@nestjs/swagger';
import { AyahTranslationDto } from './ayah-translation.dto';

export class AyahTranslationResponseDto {
  @ApiProperty({ type: AyahTranslationDto })
  data!: AyahTranslationDto;
}
