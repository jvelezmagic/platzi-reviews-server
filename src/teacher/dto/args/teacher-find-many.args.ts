import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import {
  TeacherOrderByInput,
  TeacherWhereInput,
  TeacherWhereUniqueInput,
} from '../inputs';

@ArgsType()
export class TeacherFindManyArgs implements Prisma.TeacherFindManyArgs {
  @Field((type) => TeacherWhereInput, { nullable: true })
  where?: TeacherWhereInput;

  @Field((type) => [TeacherOrderByInput], { nullable: true })
  orderBy?: TeacherOrderByInput[];

  @Field((type) => TeacherWhereUniqueInput, { nullable: true })
  cursor?: TeacherWhereUniqueInput;

  @Field((type) => Int, { nullable: true, name: 'take', defaultValue: 10 })
  take?: number;

  @Field((type) => Int, { nullable: true, name: 'skip', defaultValue: 0 })
  skip?: number;
}
