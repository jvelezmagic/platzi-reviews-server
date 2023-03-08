import { ArgsType, Field } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { ReviewWhereUniqueInput } from '../inputs';

@ArgsType()
export class ReviewFindUniqueArgs implements Prisma.ReviewFindUniqueArgs {
  @Field((type) => ReviewWhereUniqueInput, { nullable: false })
  where: ReviewWhereUniqueInput;
}
