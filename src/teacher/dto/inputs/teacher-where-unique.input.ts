import { Field, ID, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

@InputType()
export class TeacherWhereUniqueInput implements Prisma.TeacherWhereUniqueInput {
  @Field((type) => ID, { nullable: true })
  id?: string;

  @Field((type) => String, { nullable: true })
  username?: string;

  @Field((type) => String, { nullable: true })
  url?: string;
}
