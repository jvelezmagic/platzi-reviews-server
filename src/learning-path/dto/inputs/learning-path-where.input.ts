import { Field, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { BoolFilterInput, StringFilterInput } from '@common/inputs';

import { CourseListRelationFilterInput } from '@course/dto/inputs';
import { FacultyWhereInput } from '@faculty/dto/inputs';

@InputType()
export class LearningPathWhereInput implements Prisma.LearningPathWhereInput {
  @Field((type) => [LearningPathWhereInput], { nullable: true })
  AND?: LearningPathWhereInput[];

  @Field((type) => [LearningPathWhereInput], { nullable: true })
  OR?: LearningPathWhereInput[];

  @Field((type) => [LearningPathWhereInput], { nullable: true })
  NOT?: LearningPathWhereInput[];

  @Field((type) => StringFilterInput, { nullable: true })
  id?: StringFilterInput;

  @Field((type) => StringFilterInput, { nullable: true })
  slug?: StringFilterInput;

  @Field((type) => StringFilterInput, { nullable: true })
  title?: StringFilterInput;

  @Field((type) => StringFilterInput, { nullable: true })
  description?: StringFilterInput;

  @Field((type) => StringFilterInput, { nullable: true })
  url?: StringFilterInput;

  @Field((type) => StringFilterInput, { nullable: true })
  badgeUrl?: StringFilterInput;

  @Field((type) => BoolFilterInput, { nullable: true })
  isSchool?: BoolFilterInput;

  @Field((type) => CourseListRelationFilterInput, { nullable: true })
  courses?: CourseListRelationFilterInput;

  @Field((type) => FacultyWhereInput, { nullable: true })
  faculty?: FacultyWhereInput;
}
