import { ArgsType, Field } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { CourseWhereUniqueInput } from '@course/dto/inputs';

@ArgsType()
export class CourseFindUniqueArgs implements Prisma.CourseFindUniqueArgs {
  @Field((type) => CourseWhereUniqueInput, { nullable: false, name: 'where' })
  where: CourseWhereUniqueInput;
}
