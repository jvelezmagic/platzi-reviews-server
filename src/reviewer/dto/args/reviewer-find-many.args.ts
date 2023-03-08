import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import {
  ReviewerOrderByInput,
  ReviewerWhereInput,
  ReviewerWhereUniqueInput,
} from '../inputs';

@ArgsType()
export class ReviewerFindManyArgs implements Prisma.ReviewerFindManyArgs {
  @Field((type) => ReviewerWhereInput, { nullable: true })
  where?: ReviewerWhereInput;

  @Field((type) => [ReviewerOrderByInput], { nullable: true })
  orderBy?: ReviewerOrderByInput[];

  @Field((type) => ReviewerWhereUniqueInput, { nullable: true })
  cursor?: ReviewerWhereUniqueInput;

  @Field((type) => Int, { nullable: true, name: 'take', defaultValue: 10 })
  take?: number;

  @Field((type) => Int, { nullable: true, name: 'skip', defaultValue: 0 })
  skip?: number;
}
