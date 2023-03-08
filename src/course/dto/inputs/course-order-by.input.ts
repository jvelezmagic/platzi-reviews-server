import { Field, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { SortOrder } from '@common/enums';

import { FacultyOrderByInput } from '@faculty/dto/inputs';
import { LearningPathOrderByRelationAggregateInput } from '@learning-path/dto/inputs';
import { ReviewOrderByRelationAggregateInput } from '@review/dto/inputs';
import { TeacherOrderByInput } from '@teacher/dto/inputs';
import { CourseOrderByRelevanceInput } from './course-order-by-relevance.input';

@InputType()
export class CourseOrderByInput
  implements Prisma.CourseOrderByWithRelationAndSearchRelevanceInput
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
  goals?: keyof typeof SortOrder;

  @Field((type) => SortOrder, { nullable: true })
  level?: keyof typeof SortOrder;

  @Field((type) => SortOrder, { nullable: true })
  url?: keyof typeof SortOrder;

  @Field((type) => SortOrder, { nullable: true })
  badgeUrl?: keyof typeof SortOrder;

  @Field((type) => FacultyOrderByInput, { nullable: true })
  faculty?: FacultyOrderByInput;

  @Field((type) => LearningPathOrderByRelationAggregateInput, {
    nullable: true,
  })
  learningPaths?: LearningPathOrderByRelationAggregateInput;

  @Field((type) => TeacherOrderByInput, { nullable: true })
  teacher?: TeacherOrderByInput;

  @Field((type) => ReviewOrderByRelationAggregateInput, { nullable: true })
  reviews?: ReviewOrderByRelationAggregateInput;

  @Field((type) => CourseOrderByRelevanceInput, { nullable: true })
  _relevance?: CourseOrderByRelevanceInput;
}
