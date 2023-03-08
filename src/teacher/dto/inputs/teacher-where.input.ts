import { Field, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { StringFilterInput } from '@common/inputs';

import { CourseListRelationFilterInput } from '@course/dto/inputs';

@InputType()
export class TeacherWhereInput implements Prisma.TeacherWhereInput {
  @Field((type) => [TeacherWhereInput], { nullable: true })
  AND?: TeacherWhereInput[];

  @Field((type) => [TeacherWhereInput], { nullable: true })
  OR?: TeacherWhereInput[];

  @Field((type) => [TeacherWhereInput], { nullable: true })
  NOT?: TeacherWhereInput[];

  @Field((type) => StringFilterInput, { nullable: true })
  username?: StringFilterInput;

  @Field((type) => StringFilterInput, { nullable: true })
  name?: StringFilterInput;

  @Field((type) => StringFilterInput, { nullable: true })
  description?: StringFilterInput;

  @Field((type) => StringFilterInput, { nullable: true })
  url?: StringFilterInput;

  @Field((type) => StringFilterInput, { nullable: true })
  avatarUrl?: StringFilterInput;

  @Field((type) => CourseListRelationFilterInput, { nullable: true })
  courses?: CourseListRelationFilterInput;
}
