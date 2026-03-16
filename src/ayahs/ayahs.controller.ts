import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AyahResponseDto } from './dto/ayah-response.dto';
import { GetAyahParamsDto } from './dto/get-ayah-params.dto';
import { GetAyahQueryDto } from './dto/get-ayah-query.dto';
import { AyahService } from './ayahs.service';

@ApiTags('Ayahs')
@Controller('ayahs')
export class AyahController {
  constructor(private readonly ayahService: AyahService) {}

  @Get(':surahNumber/:ayahNumber')
  @ApiOperation({
    summary: 'Get one verse and its translations',
  })
  @ApiParam({
    name: 'surahNumber',
    description: 'Surah number from the source dataset.',
    schema: { type: 'integer', minimum: 1 },
  })
  @ApiParam({
    name: 'ayahNumber',
    description:
      'Verse key from the source dataset. 0 is the surah title, 0,5 is the Bismillah row, and some rare composite keys also exist.',
    schema: { type: 'string', example: '255' },
  })
  @ApiQuery({
    name: 'source',
    required: false,
    description:
      'Optional comma-separated source codes. When omitted, all sources for the verse are returned.',
    schema: { type: 'string', example: 'hamidullah-fr,masson-fr' },
  })
  @ApiOkResponse({
    description:
      'Verse-aligned response with translations ordered by request or source chronology.',
    type: AyahResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid path or query parameters.',
  })
  @ApiNotFoundResponse({
    description:
      'Verse not found for the given surah number and dataset verse key.',
  })
  async getAyah(
    @Param() params: GetAyahParamsDto,
    @Query() query: GetAyahQueryDto,
  ): Promise<AyahResponseDto> {
    return this.ayahService.getAyah(
      params.surahNumber,
      params.ayahNumber,
      query.source,
    );
  }
}
