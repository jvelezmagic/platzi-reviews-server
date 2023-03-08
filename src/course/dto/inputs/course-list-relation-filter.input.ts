import { Field, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { CourseWhereInput } from './course-where.input';

@InputType()
export class CourseListRelationFilterInput
  implements Prisma.CourseListRelationFilter
{
  @Field((type) => CourseWhereInput, { nullable: true })
  every?: CourseWhereInput;

  @Field((type) => CourseWhereInput, { nullable: true })
  some?: CourseWhereInput;

  @Field((type) => CourseWhereInput, { nullable: true })
  none?: CourseWhereInput;
}
