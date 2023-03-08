import { Field, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { IntFilterInput, StringFilterInput } from '@common/inputs';

import { CourseWhereInput } from '@course/dto/inputs';
import { ReviewerWhereInput } from '@reviewer/dto/inputs';

@InputType()
export class ReviewWhereInput implements Prisma.ReviewWhereInput {
  @Field((type) => [ReviewWhereInput], { nullable: true })
  AND?: ReviewWhereInput[];

  @Field((type) => [ReviewWhereInput], { nullable: true })
  OR?: ReviewWhereInput[];

  @Field((type) => [ReviewWhereInput], { nullable: true })
  NOT?: ReviewWhereInput[];

  @Field((type) => StringFilterInput, { nullable: true })
  id?: StringFilterInput;

  @Field((type) => CourseWhereInput, { nullable: true })
  course: CourseWhereInput;

  @Field((type) => ReviewerWhereInput, { nullable: true })
  reviewer: ReviewerWhereInput;

  @Field((type) => StringFilterInput, { nullable: true })
  content?: StringFilterInput;

  @Field((type) => IntFilterInput, { nullable: true })
  rating?: IntFilterInput;
}
