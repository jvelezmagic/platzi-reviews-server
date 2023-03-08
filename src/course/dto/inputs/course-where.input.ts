import { Field, HideField, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { StringFilterInput, StringListFilterInput } from '@common/inputs';

import { FacultyWhereInput } from '@faculty/dto/inputs';
import { LearningPathListRelationFilterInput } from '@learning-path/dto/inputs';
import { ReviewListRelationFilterInput } from '@review/dto/inputs';
import { TeacherWhereInput } from '@teacher/dto/inputs';
import { CourseLevelFilterInput } from './course-level-filter.input';

@InputType()
export class CourseWhereInput implements Prisma.CourseWhereInput {
  @Field((type) => [CourseWhereInput], { nullable: true })
  AND?: CourseWhereInput[];

  @Field((type) => [CourseWhereInput], { nullable: true })
  OR?: CourseWhereInput[];

  @Field((type) => [CourseWhereInput], { nullable: true })
  NOT?: CourseWhereInput[];

  @Field((type) => StringFilterInput, { nullable: true })
  id?: StringFilterInput;

  @HideField()
  facultyId?: StringFilterInput;

  @HideField()
  teacherId?: StringFilterInput;

  @Field((type) => StringFilterInput, { nullable: true })
  slug?: StringFilterInput;

  @Field((type) => StringFilterInput, { nullable: true })
  title?: StringFilterInput;

  @Field((type) => StringFilterInput, { nullable: true })
  description?: StringFilterInput;

  @Field((type) => StringListFilterInput, { nullable: true })
  goals?: StringListFilterInput;

  @Field((type) => CourseLevelFilterInput, { nullable: true })
  level?: CourseLevelFilterInput;

  @Field((type) => StringFilterInput, { nullable: true })
  url?: StringFilterInput;

  @Field((type) => StringFilterInput, { nullable: true })
  badgeUrl?: StringFilterInput;

  @Field((type) => TeacherWhereInput, { nullable: true })
  teacher?: TeacherWhereInput;

  @Field((type) => FacultyWhereInput, { nullable: true })
  faculty?: FacultyWhereInput;

  @Field((type) => LearningPathListRelationFilterInput, { nullable: true })
  learningPaths?: LearningPathListRelationFilterInput;

  @Field((type) => ReviewListRelationFilterInput, { nullable: true })
  reviews?: ReviewListRelationFilterInput;
}
