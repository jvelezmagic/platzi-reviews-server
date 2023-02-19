import { Module } from '@nestjs/common';
import { PlatziScraperService } from './platzi-scraper.service';

@Module({
  providers: [PlatziScraperService],
})
export class PlatziScraperModule {}
