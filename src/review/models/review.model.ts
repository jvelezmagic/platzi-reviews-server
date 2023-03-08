import { Field, HideField, ID, Int, ObjectType } from '@nestjs/graphql';
import Prisma from '@prisma/client';

@ObjectType()
export class Review implements Prisma.Review {
  @Field((type) => ID)
  id: string;

  @HideField()
  reviewerUsername: string;

  @HideField()
  courseSlug: string;

  @Field((type) => String)
  content: string;

  @Field((type) => Int)
  rating: number;
}
