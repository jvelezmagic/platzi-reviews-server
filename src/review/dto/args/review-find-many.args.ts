import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import {
  ReviewOrderByInput,
  ReviewWhereInput,
  ReviewWhereUniqueInput,
} from '../inputs';

@ArgsType()
export class ReviewFindManyArgs implements Prisma.ReviewFindManyArgs {
  @Field((type) => ReviewWhereInput, { nullable: true })
  where?: ReviewWhereInput;

  @Field((type) => [ReviewOrderByInput], { nullable: true })
  orderBy?: ReviewOrderByInput[];

  @Field((type) => ReviewWhereUniqueInput, { nullable: true })
  cursor?: ReviewWhereUniqueInput;

  @Field((type) => Int, { nullable: true, name: 'take', defaultValue: 10 })
  take?: number;

  @Field((type) => Int, { nullable: true, name: 'skip', defaultValue: 0 })
  skip?: number;
}
