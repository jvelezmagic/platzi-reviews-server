import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { IsOptional, Max, Min } from 'class-validator';

import {
  LearningPathOrderByInput,
  LearningPathWhereInput,
  LearningPathWhereUniqueInput,
} from '../inputs';

@ArgsType()
export class LearningPathFindManyArgs
  implements Prisma.LearningPathFindManyArgs
{
  @Field((type) => LearningPathWhereInput, { nullable: true })
  where?: LearningPathWhereInput;

  @Field((type) => [LearningPathOrderByInput], { nullable: true })
  orderBy?: LearningPathOrderByInput[];

  @Field((type) => LearningPathWhereUniqueInput, { nullable: true })
  cursor?: LearningPathWhereUniqueInput;

  @Field((type) => Int, { nullable: true, name: 'take', defaultValue: 10 })
  @Max(30)
  @Min(1)
  @IsOptional()
  take?: number;

  @Field((type) => Int, { nullable: true, name: 'skip', defaultValue: 0 })
  @Min(0)
  @IsOptional()
  skip?: number;
}
