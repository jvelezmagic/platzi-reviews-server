import { ArgsType, Field, Int } from '@nestjs/graphql';

import {
  LearningPathOrderByInput,
  LearningPathWhereInput,
  LearningPathWhereUniqueInput,
} from '../inputs';

@ArgsType()
export class LearningPathFindManyArgs {
  @Field((type) => LearningPathWhereInput, { nullable: true })
  where?: LearningPathWhereInput;

  @Field((type) => [LearningPathOrderByInput], { nullable: true })
  orderBy?: LearningPathOrderByInput[];

  @Field((type) => LearningPathWhereUniqueInput, { nullable: true })
  cursor?: LearningPathWhereUniqueInput;

  @Field((type) => Int, { nullable: true, name: 'take', defaultValue: 10 })
  take?: number;

  @Field((type) => Int, { nullable: true, name: 'skip', defaultValue: 0 })
  skip?: number;
}
