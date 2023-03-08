import { Field, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { SortOrder } from '@common/enums';

import { CourseOrderByRelevanceFieldEnum } from '@course/enums';

@InputType()
export class CourseOrderByRelevanceInput
  implements Prisma.CourseOrderByRelevanceInput
{
  @Field((type) => [CourseOrderByRelevanceFieldEnum])
  fields: keyof typeof CourseOrderByRelevanceFieldEnum;

  @Field((type) => SortOrder)
  sort: keyof typeof SortOrder;

  @Field((type) => String)
  search: string;
}
