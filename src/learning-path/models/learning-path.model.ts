import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import Prisma from '@prisma/client';

@ObjectType()
export class LearningPath implements Prisma.LearningPath {
  @Field((type) => ID)
  id: string;

  @HideField()
  facultyId: string;

  @Field((type) => String)
  slug: string;

  @Field((type) => String)
  title: string;

  @Field((type) => String)
  description: string;

  @Field((type) => String)
  url: string;

  @Field((type) => String)
  badgeUrl: string;

  @Field((type) => Boolean)
  isSchool: boolean;
}
