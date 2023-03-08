import { Field, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { SortOrder } from '@common/enums';

@InputType()
export class LearningPathOrderByRelationAggregateInput
  implements Prisma.LearningPathOrderByRelationAggregateInput
{
  @Field((type) => SortOrder, { nullable: false })
  _count?: SortOrder;
}
