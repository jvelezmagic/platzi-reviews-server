import { Field, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { SortOrder } from '@common/enums';

@InputType()
export class CourseOrderByRelationAggregateInput
  implements Prisma.CourseOrderByRelationAggregateInput
{
  @Field((type) => SortOrder, { nullable: false })
  _count?: SortOrder;
}
