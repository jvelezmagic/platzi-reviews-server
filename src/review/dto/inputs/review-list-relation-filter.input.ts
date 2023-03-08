import { Field, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { ReviewWhereInput } from './review-where.input';

@InputType()
export class ReviewListRelationFilterInput
  implements Prisma.ReviewListRelationFilter
{
  @Field((type) => ReviewWhereInput, { nullable: true })
  every?: ReviewWhereInput;

  @Field((type) => ReviewWhereInput, { nullable: true })
  some?: ReviewWhereInput;

  @Field((type) => ReviewWhereInput, { nullable: true })
  none?: ReviewWhereInput;
}
