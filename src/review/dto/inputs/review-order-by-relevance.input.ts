import { Field, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { SortOrder } from '@common/enums';

import { ReviewOrderByRelevanceFieldEnum } from '@review/enums';

@InputType()
export class ReviewOrderByRelevanceInput
  implements Prisma.ReviewOrderByRelevanceInput
{
  @Field((type) => [ReviewOrderByRelevanceFieldEnum])
  fields: Array<ReviewOrderByRelevanceFieldEnum>;

  @Field((type) => SortOrder, { defaultValue: 'asc' })
  sort: keyof typeof SortOrder;

  @Field((type) => String, { nullable: true })
  search: string;
}
