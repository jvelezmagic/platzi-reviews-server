import { Field, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { SortOrder } from '@common/enums';

import { LearningPathOrderByRelevanceFieldEnum } from '@learning-path/enums';

@InputType()
export class LearningPathOrderByRelevanceInput
  implements Prisma.LearningPathOrderByRelevanceInput
{
  @Field((type) => [LearningPathOrderByRelevanceFieldEnum])
  fields: Array<LearningPathOrderByRelevanceFieldEnum>;

  @Field((type) => SortOrder, { defaultValue: 'asc' })
  sort: keyof typeof SortOrder;

  @Field((type) => String, { nullable: true })
  search: string;
}
