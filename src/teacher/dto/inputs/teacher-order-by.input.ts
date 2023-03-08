import { Field, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { SortOrder } from '@common/enums';

import { CourseOrderByRelationAggregateInput } from '@course/dto/inputs';
import { TeacherOrderByRelevanceInput } from './teacher-order-by-relevance.input';

@InputType()
export class TeacherOrderByInput
  implements Prisma.TeacherOrderByWithRelationAndSearchRelevanceInput
{
  @Field((type) => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;

  @Field((type) => SortOrder, { nullable: true })
  username?: keyof typeof SortOrder;

  @Field((type) => SortOrder, { nullable: true })
  name?: keyof typeof SortOrder;

  @Field((type) => SortOrder, { nullable: true })
  description?: keyof typeof SortOrder;

  @Field((type) => SortOrder, { nullable: true })
  url?: keyof typeof SortOrder;

  @Field((type) => SortOrder, { nullable: true })
  avatarUrl?: SortOrder;

  @Field((type) => CourseOrderByRelationAggregateInput, { nullable: true })
  courses?: CourseOrderByRelationAggregateInput;

  @Field((type) => TeacherOrderByRelevanceInput, { nullable: true })
  _relevance?: TeacherOrderByRelevanceInput;
}
