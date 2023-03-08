import { ArgsType, Field } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { TeacherWhereUniqueInput } from '../inputs';

@ArgsType()
export class TeacherFindUniqueArgs implements Prisma.TeacherFindUniqueArgs {
  @Field((type) => TeacherWhereUniqueInput)
  where: TeacherWhereUniqueInput;
}
