import { Field, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { StringFilterInput } from '@common/inputs';

import { CourseListRelationFilterInput } from '@course/dto/inputs';
import { LearningPathListRelationFilterInput } from '@learning-path/dto/inputs';

@InputType()
export class FacultyWhereInput implements Prisma.FacultyWhereInput {
  @Field((type) => [FacultyWhereInput], { nullable: true })
  AND?: FacultyWhereInput[];

  @Field((type) => [FacultyWhereInput], { nullable: true })
  OR?: FacultyWhereInput[];

  @Field((type) => [FacultyWhereInput], { nullable: true })
  NOT?: FacultyWhereInput[];

  @Field((type) => StringFilterInput, { nullable: true })
  id?: StringFilterInput;

  @Field((type) => StringFilterInput, { nullable: true })
  slug?: StringFilterInput;

  @Field((type) => StringFilterInput, { nullable: true })
  title?: StringFilterInput;

  @Field((type) => CourseListRelationFilterInput, { nullable: true })
  courses?: CourseListRelationFilterInput;

  @Field((type) => LearningPathListRelationFilterInput, { nullable: true })
  learningPaths?: LearningPathListRelationFilterInput;
}
