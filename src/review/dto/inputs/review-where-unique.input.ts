import { Field, ID, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

@InputType()
export class ReviewWhereUniqueInput implements Prisma.ReviewerWhereUniqueInput {
  @Field((type) => ID)
  id?: string;

  @Field((type) => String)
  username?: string;
}
