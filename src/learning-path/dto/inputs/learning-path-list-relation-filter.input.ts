import { Field, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { LearningPathWhereInput } from './learning-path-where.input';

@InputType()
export class LearningPathListRelationFilterInput
  implements Prisma.LearningPathListRelationFilter
{
  @Field((type) => LearningPathWhereInput, { nullable: true })
  every?: LearningPathWhereInput;

  @Field((type) => LearningPathWhereInput, { nullable: true })
  some?: LearningPathWhereInput;

  @Field((type) => LearningPathWhereInput, { nullable: true })
  none?: LearningPathWhereInput;
}
