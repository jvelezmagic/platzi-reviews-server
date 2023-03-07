import { Resolver } from '@nestjs/graphql';
import { ReviewerService } from './reviewer.service';

@Resolver()
export class ReviewerResolver {
  constructor(private readonly reviewerService: ReviewerService) {}
}
