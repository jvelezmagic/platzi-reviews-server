import { Field, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { SortOrder } from '@common/enums';

@InputType()
export class ReviewOrderByRelationAggregateInput
  implements Prisma.ReviewOrderByRelationAggregateInput
{
  @Field((type) => SortOrder, { nullable: false })
  _count?: SortOrder;
}
