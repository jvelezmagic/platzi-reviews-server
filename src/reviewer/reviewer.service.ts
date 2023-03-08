import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { Review } from '@review/models/review.model';
import { Reviewer } from './models/reviewer.model';

import { ReviewFindManyArgs } from '@review/dto/args';
import { ReviewerFindManyArgs, ReviewerFindUniqueArgs } from './dto/args';

@Injectable()
export class ReviewerService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(args: ReviewerFindUniqueArgs): Promise<Reviewer> {
    const reviewer = await this.prisma.reviewer.findUnique(args);
    return reviewer;
  }

  async findMany(args: ReviewerFindManyArgs): Promise<Reviewer[]> {
    const reviews = await this.prisma.reviewer.findMany(args);
    return reviews;
  }

  async reviews(review: Reviewer, args: ReviewFindManyArgs): Promise<Review[]> {
    const reviews = await this.prisma.reviewer
      .findUnique({
        where: {
          id: review.id,
        },
      })
      .reviews(args);

    return reviews;
  }
}
