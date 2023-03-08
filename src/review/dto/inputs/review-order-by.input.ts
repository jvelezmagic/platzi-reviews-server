import { Field, HideField, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { SortOrder } from '@common/enums';

import { CourseOrderByInput } from '@course/dto/inputs';
import { ReviewerOrderByInput } from '@reviewer/dto/inputs';
import { ReviewOrderByRelevanceInput } from './review-order-by-relevance.input';

@InputType()
export class ReviewOrderByInput
  implements Prisma.ReviewOrderByWithRelationAndSearchRelevanceInput
{
  @Field((type) => SortOrder, { nullable: true })
  id?: keyof typeof SortOrder;

  @HideField()
  reviewerUsername?: keyof typeof SortOrder;

  @HideField()
  courseSlug?: keyof typeof SortOrder;

  @Field((type) => SortOrder, { nullable: true })
  content?: keyof typeof SortOrder;

  @Field((type) => SortOrder, { nullable: true })
  rating?: keyof typeof SortOrder;

  @Field((type) => ReviewOrderByInput, { nullable: true })
  reviewer?: ReviewerOrderByInput;

  @Field((type) => CourseOrderByInput, { nullable: true })
  course?: CourseOrderByInput;

  @Field((type) => ReviewOrderByRelevanceInput, { nullable: true })
  _relevance?: ReviewOrderByRelevanceInput;
}
