import { Field, ID, ObjectType } from '@nestjs/graphql';
import Prisma from '@prisma/client';

@ObjectType()
export class Reviewer implements Prisma.Reviewer {
  @Field((type) => ID)
  id: string;

  @Field((type) => String)
  username: string;

  @Field((type) => String)
  name: string;

  @Field((type) => String)
  avatarUrl: string;
}
