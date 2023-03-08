import { Field, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

@InputType()
export class StringListFilterInput implements Prisma.StringNullableListFilter {
  @Field((type) => [String], { nullable: true })
  equals?: Array<string>;

  @Field((type) => String, { nullable: true })
  has?: string;

  @Field((type) => [String], { nullable: true })
  hasEvery?: Array<string>;

  @Field((type) => [String], { nullable: true })
  hasSome?: Array<string>;

  @Field((type) => Boolean, { nullable: true })
  isEmpty?: boolean;
}
