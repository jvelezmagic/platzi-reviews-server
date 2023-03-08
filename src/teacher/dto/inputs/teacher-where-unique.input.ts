import { Field, ID, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

@InputType()
export class TeacherWhereUniqueInput implements Prisma.TeacherWhereUniqueInput {
  @Field((type) => ID)
  id?: string;

  @Field((type) => String)
  username?: string;

  @Field((type) => String)
  url?: string;
}
