import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ReviewerService } from './reviewer.service';

import { Review } from '@review/models/review.model';
import { Reviewer } from './models/reviewer.model';

import { ReviewFindManyArgs } from '@review/dto/args';
import { ReviewerFindManyArgs, ReviewerFindUniqueArgs } from './dto/args';

@Resolver((of) => Reviewer)
export class ReviewerResolver {
  constructor(private readonly reviewService: ReviewerService) {}

  @Query((returns) => Reviewer, {
    nullable: true,
    name: 'reviewer',
    description: undefined,
  })
  async findUnique(@Args() args: ReviewerFindUniqueArgs): Promise<Reviewer> {
    return this.reviewService.findUnique(args);
  }

  @Query((returns) => [Reviewer], {
    nullable: false,
    name: 'reviewers',
    description: undefined,
  })
  async findMany(@Args() args: ReviewerFindManyArgs): Promise<Reviewer[]> {
    return this.reviewService.findMany(args);
  }

  @ResolveField((returns) => [Review], {
    nullable: false,
    name: 'reviews',
    description: undefined,
  })
  async reviews(
    @Parent() reviewer: Reviewer,
    @Args() args: ReviewFindManyArgs,
  ): Promise<Review[]> {
    return this.reviewService.reviews(reviewer, args);
  }
}
