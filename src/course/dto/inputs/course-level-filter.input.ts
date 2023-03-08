import { Field, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { CourseLevel } from '@course/enums';

@InputType()
export class CourseLevelFilterInput implements Prisma.EnumCourseLevelFilter {
  @Field((type) => CourseLevel, { nullable: true })
  equals?: keyof typeof CourseLevel;

  @Field((type) => [CourseLevel], { nullable: true })
  in?: Array<keyof typeof CourseLevel>;

  @Field((type) => [CourseLevel], { nullable: true })
  notIn?: Array<keyof typeof CourseLevel>;

  @Field((type) => CourseLevelFilterInput, { nullable: true })
  not?: CourseLevelFilterInput;
}
