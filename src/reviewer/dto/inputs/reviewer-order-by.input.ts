import { Field, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { SortOrder } from '@common/enums';

import { ReviewOrderByRelationAggregateInput } from '@review/dto/inputs';
import { ReviewerOrderByRelevanceInput } from './reviewer-order-by-relevance.input';

@InputType()
export class ReviewerOrderByInput
  implements Prisma.ReviewerOrderByWithRelationAndSearchRelevanceInput
{
  @Field((type) => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;

  @Field((type) => SortOrder, { nullable: true })
  username?: keyof typeof SortOrder;

  @Field((type) => SortOrder, { nullable: true })
  name?: keyof typeof SortOrder;

  @Field((type) => SortOrder, { nullable: true })
  avatarUrl?: keyof typeof SortOrder;

  @Field((type) => ReviewOrderByRelationAggregateInput, { nullable: true })
  reviews: ReviewOrderByRelationAggregateInput;

  @Field((type) => ReviewerOrderByRelevanceInput, { nullable: true })
  _relevance?: ReviewerOrderByRelevanceInput;
}
