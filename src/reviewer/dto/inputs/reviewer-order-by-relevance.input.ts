import { Field, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { SortOrder } from '@common/enums';

import { ReviewerOrderByRelevanceFieldEnum } from '@reviewer/enums';

@InputType()
export class ReviewerOrderByRelevanceInput
  implements Prisma.ReviewerOrderByRelevanceInput
{
  @Field((type) => [ReviewerOrderByRelevanceFieldEnum])
  fields: Array<ReviewerOrderByRelevanceFieldEnum>;

  @Field((type) => SortOrder, { defaultValue: 'asc' })
  sort: keyof typeof SortOrder;

  @Field((type) => String, { nullable: true })
  search: string;
}
