import { Field, ID, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

@InputType()
export class FacultyWhereUniqueInput implements Prisma.FacultyWhereUniqueInput {
  @Field((type) => ID, { nullable: true })
  id?: string;

  @Field((type) => String, { nullable: true })
  slug?: string;
}
