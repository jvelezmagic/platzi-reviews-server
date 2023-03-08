import { Field, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { SortOrder } from '@common/enums';

import { CourseOrderByRelationAggregateInput } from '@course/dto/inputs';
import { FacultyOrderByInput } from '@faculty/dto/inputs';
import { LearningPathOrderByRelevanceInput } from './learning-path-order-by-relevance.input';

@InputType()
export class LearningPathOrderByInput
  implements Prisma.LearningPathOrderByWithRelationAndSearchRelevanceInput
{
  @Field((type) => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;

  @Field((type) => SortOrder, { nullable: true })
  slug?: keyof typeof SortOrder;

  @Field((type) => SortOrder, { nullable: true })
  title?: keyof typeof SortOrder;

  @Field((type) => SortOrder, { nullable: true })
  description?: keyof typeof SortOrder;

  @Field((type) => SortOrder, { nullable: true })
  url?: keyof typeof SortOrder;

  @Field((type) => SortOrder, { nullable: true })
  badgeUrl?: keyof typeof SortOrder;

  @Field((type) => SortOrder, { nullable: true })
  isSchool?: keyof typeof SortOrder;

  @Field((type) => FacultyOrderByInput, { nullable: true })
  faculty?: FacultyOrderByInput;

  @Field((type) => CourseOrderByRelationAggregateInput, { nullable: true })
  courses?: CourseOrderByRelationAggregateInput;

  @Field((type) => LearningPathOrderByRelevanceInput, { nullable: true })
  _relevance?: LearningPathOrderByRelevanceInput;
}
