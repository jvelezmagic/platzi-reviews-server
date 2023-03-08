import { Field, InputType, Int } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

@InputType()
export class IntFilterInput implements Prisma.IntFilter {
  @Field((type) => Int, { nullable: true })
  equals?: number;

  @Field((type) => [Int], { nullable: true })
  in?: Array<number>;

  @Field((type) => [Int], { nullable: true })
  notIn?: Array<number>;

  @Field((type) => Int, { nullable: true })
  lt?: number;

  @Field((type) => Int, { nullable: true })
  lte?: number;

  @Field((type) => Int, { nullable: true })
  gt?: number;

  @Field((type) => Int, { nullable: true })
  gte?: number;

  @Field((type) => IntFilterInput, { nullable: true })
  not?: IntFilterInput;
}
