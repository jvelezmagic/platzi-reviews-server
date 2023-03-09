import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { ReviewService } from './review.service';

import { Course } from '@course/models/course.model';
import { Reviewer } from '@reviewer/models/reviewer.model';
import { Review } from './models/review.model';

import { ReviewFindManyArgs, ReviewFindUniqueArgs } from './dto/args';

@Resolver((of) => Review)
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @Query((returns) => Review, {
    nullable: true,
    name: 'review',
    description: undefined,
  })
  async findUnique(@Args() args: ReviewFindUniqueArgs): Promise<Review> {
    return this.reviewService.findUnique(args);
  }

  @Query((returns) => [Review], {
    nullable: false,
    name: 'reviews',
    description: undefined,
  })
  async findMany(@Args() args: ReviewFindManyArgs): Promise<Review[]> {
    return this.reviewService.findMany(args);
  }

  @ResolveField((returns) => Reviewer, {
    nullable: false,
    name: 'reviewer',
    description: undefined,
  })
  async reviewer(@Parent() review: Review): Promise<Reviewer> {
    return this.reviewService.reviewer(review);
  }

  @ResolveField((returns) => Course, {
    nullable: false,
    name: 'course',
    description: undefined,
  })
  async course(@Parent() review: Review): Promise<Course> {
    return this.reviewService.course(review);
  }
}
