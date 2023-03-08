import { Field, ID, ObjectType } from '@nestjs/graphql';
import Prisma from '@prisma/client';

@ObjectType()
export class Teacher implements Prisma.Teacher {
  @Field((type) => ID)
  id: string;

  @Field((type) => String)
  username: string;

  @Field((type) => String)
  name: string;

  @Field((type) => String, { nullable: true })
  description: string | null;

  @Field((type) => String)
  url: string;

  @Field((type) => String)
  avatarUrl: string;
}
