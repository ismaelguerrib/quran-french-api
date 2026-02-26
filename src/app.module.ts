import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { VersesModule } from './verses/verses.module';

@Module({
  imports: [VersesModule],
  controllers: [AppController],
})
export class AppModule {}
