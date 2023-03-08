import { Module } from '@nestjs/common';
import { ReviewerService } from './reviewer.service';
import { ReviewerResolver } from './reviewer.resolver';

@Module({
  providers: [ReviewerResolver, ReviewerService],
})
export class ReviewerModule {}
