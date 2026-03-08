import { Module } from '@nestjs/common';
import { AyahController } from './ayahs.controller';
import { AyahService } from './ayahs.service';

@Module({
  controllers: [AyahController],
  providers: [AyahService],
})
export class AyahModule {}
