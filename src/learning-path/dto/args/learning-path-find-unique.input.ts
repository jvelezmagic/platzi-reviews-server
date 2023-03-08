import { ArgsType, Field } from '@nestjs/graphql';
import { LearningPathWhereUniqueInput } from '../inputs';

@ArgsType()
export class LearningPathFindUniqueArgs {
  @Field((type) => LearningPathWhereUniqueInput, { nullable: false })
  where: LearningPathWhereUniqueInput;
}
