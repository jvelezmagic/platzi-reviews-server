import { Field, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { SortOrder } from '@common/enums';

import { CourseOrderByRelationAggregateInput } from '@course/dto/inputs';
import { LearningPathOrderByRelationAggregateInput } from '@learning-path/dto/inputs';
import { FacultyOrderByRelevanceInput } from './faculty-order-by-relavance.input';

@InputType()
export class FacultyOrderByInput
  implements Prisma.FacultyOrderByWithRelationAndSearchRelevanceInput
{
  @Field((type) => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;

  @Field((type) => SortOrder, { nullable: true })
  slug?: keyof typeof SortOrder;

  @Field((type) => SortOrder, { nullable: true })
  title?: keyof typeof SortOrder;

  @Field((type) => SortOrder, { nullable: true })
  description?: keyof typeof SortOrder;

  @Field((type) => CourseOrderByRelationAggregateInput, { nullable: true })
  courses?: CourseOrderByRelationAggregateInput;

  @Field((type) => LearningPathOrderByRelationAggregateInput, {
    nullable: true,
  })
  learningPaths?: LearningPathOrderByRelationAggregateInput;

  @Field((type) => FacultyOrderByRelevanceInput, { nullable: true })
  _relevance?: FacultyOrderByRelevanceInput;
}
