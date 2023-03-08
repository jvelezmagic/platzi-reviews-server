import { Field, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

@InputType()
export class BoolFilterInput implements Prisma.BoolFilter {
  @Field((type) => Boolean, { nullable: true })
  equals?: boolean;

  @Field((type) => BoolFilterInput, { nullable: true })
  not?: BoolFilterInput;
}
