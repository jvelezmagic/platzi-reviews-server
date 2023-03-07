import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import Prisma from '@prisma/client';

import { CourseLevel } from '../enums/course-level.enum';

@ObjectType()
export class Course implements Prisma.Course {
  @Field((type) => ID)
  id: string;

  @HideField()
  facultyId: string;

  @HideField()
  teacherId: string;

  @Field((type) => String)
  slug: string;

  @Field((type) => String)
  title: string;

  @Field((type) => String)
  description: string;

  @Field((type) => [String])
  goals: string[];

  @Field((type) => CourseLevel)
  level: keyof typeof CourseLevel;

  @Field((type) => String)
  url: string;

  @Field((type) => String)
  badgeUrl: string;

  @HideField()
  expectedReviews: number;

  @HideField()
  areReviewsAlreadyScraped: boolean;
}
