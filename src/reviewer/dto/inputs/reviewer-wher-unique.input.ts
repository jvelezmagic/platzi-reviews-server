import { Field, ID, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

@InputType()
export class ReviewerWhereUniqueInput
  implements Prisma.ReviewerWhereUniqueInput
{
  @Field((type) => ID, { nullable: true })
  id?: string;

  @Field((type) => String, { nullable: true })
  username?: string;
}
