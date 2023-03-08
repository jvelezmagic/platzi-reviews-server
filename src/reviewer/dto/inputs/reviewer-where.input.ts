import { Field, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { StringFilterInput } from '@common/inputs';

import { ReviewListRelationFilterInput } from '@review/dto/inputs';

@InputType()
export class ReviewerWhereInput implements Prisma.ReviewerWhereInput {
  @Field((type) => [ReviewerWhereInput], { nullable: true })
  AND?: ReviewerWhereInput[];

  @Field((type) => [ReviewerWhereInput], { nullable: true })
  OR?: ReviewerWhereInput[];

  @Field((type) => [ReviewerWhereInput], { nullable: true })
  NOT?: ReviewerWhereInput[];

  @Field((type) => StringFilterInput, { nullable: true })
  id?: StringFilterInput;

  @Field((type) => StringFilterInput, { nullable: true })
  username?: StringFilterInput;

  @Field((type) => StringFilterInput, { nullable: true })
  name?: StringFilterInput;

  @Field((type) => StringFilterInput, { nullable: true })
  avatartUrl?: StringFilterInput;

  @Field((type) => ReviewListRelationFilterInput, { nullable: true })
  reviews?: ReviewListRelationFilterInput;
}
