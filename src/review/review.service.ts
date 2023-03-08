import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { Course } from '@course/models/course.model';
import { Reviewer } from '@reviewer/models/reviewer.model';
import { Review } from './models/review.model';

import { ReviewFindManyArgs, ReviewFindUniqueArgs } from './dto/args';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(args: ReviewFindUniqueArgs): Promise<Review> {
    const review = await this.prisma.review.findUnique(args);
    return review;
  }

  async findMany(args: ReviewFindManyArgs): Promise<Review[]> {
    const reviews = await this.prisma.review.findMany(args);
    return reviews;
  }

  async reviewer(review: Review): Promise<Reviewer> {
    const reviewer = await this.prisma.review
      .findUnique({
        where: {
          id: review.id,
        },
      })
      .reviewer();

    return reviewer;
  }

  async course(review: Review): Promise<Course> {
    const course = await this.prisma.review
      .findUnique({
        where: {
          id: review.id,
        },
      })
      .course();

    return course;
  }
}
