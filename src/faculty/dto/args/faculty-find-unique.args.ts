import { ArgsType, Field } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { FacultyWhereUniqueInput } from '../inputs';

@ArgsType()
export class FacultyFindUniqueArgs implements Prisma.FacultyFindUniqueArgs {
  @Field((type) => FacultyWhereUniqueInput, { nullable: false })
  where: FacultyWhereUniqueInput;
}
