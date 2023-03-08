import { ArgsType, Field } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { ReviewerWhereUniqueInput } from '../inputs';

@ArgsType()
export class ReviewerFindUniqueArgs implements Prisma.ReviewerFindUniqueArgs {
  @Field((type) => ReviewerWhereUniqueInput, { nullable: false })
  where: ReviewerWhereUniqueInput;
}
