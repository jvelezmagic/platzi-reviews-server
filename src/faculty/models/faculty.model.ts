import { Field, ID, ObjectType } from '@nestjs/graphql';
import Prisma from '@prisma/client';

@ObjectType()
export class Faculty implements Prisma.Faculty {
  @Field((type) => ID)
  id: string;

  @Field((type) => String)
  slug: string;

  @Field((type) => String)
  title: string;
}
