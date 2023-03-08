import { Field, ID, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

@InputType()
export class LearningPathWhereUniqueInput
  implements Prisma.LearningPathWhereUniqueInput
{
  @Field((type) => ID, { nullable: true })
  id?: string;

  @Field((type) => String, { nullable: true })
  slug?: string;

  @Field((type) => String, { nullable: true })
  url?: string;
}
