import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import {
  CourseOrderByInput,
  CourseWhereInput,
  CourseWhereUniqueInput,
} from '../inputs';

@ArgsType()
export class CourseFindManyArgs implements Prisma.CourseFindManyArgs {
  @Field((type) => CourseWhereInput, { nullable: true, name: 'where' })
  where?: CourseWhereInput;

  @Field((type) => [CourseOrderByInput], { nullable: true, name: 'orderBy' })
  orderBy?: CourseOrderByInput[];

  @Field((type) => CourseWhereUniqueInput, { nullable: true, name: 'cursor' })
  cursor?: CourseWhereUniqueInput;

  @Field((type) => Int, { nullable: true, name: 'take', defaultValue: 10 })
  take?: number;

  @Field((type) => Int, { nullable: true, name: 'skip', defaultValue: 0 })
  skip?: number;
}
