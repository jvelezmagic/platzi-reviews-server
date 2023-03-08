import { Field, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { QueryMode } from '@common/enums';

@InputType()
export class StringFilterInput implements Prisma.StringFilter {
  @Field((type) => String, { nullable: true })
  equals?: string;

  @Field((type) => [String], { nullable: true })
  in?: Array<string>;

  @Field((type) => [String], { nullable: true })
  notIn?: Array<string>;

  @Field((type) => String, { nullable: true })
  lt?: string;

  @Field((type) => String, { nullable: true })
  lte?: string;

  @Field((type) => String, { nullable: true })
  gt?: string;

  @Field((type) => String, { nullable: true })
  gte?: string;

  @Field((type) => String, { nullable: true })
  contains?: string;

  @Field((type) => String, { nullable: true })
  startsWith?: string;

  @Field((type) => String, { nullable: true })
  endsWith?: string;

  @Field((type) => StringFilterInput, { nullable: true })
  not?: StringFilterInput;

  @Field((type) => QueryMode, { nullable: true })
  mode?: keyof typeof QueryMode;

  @Field((type) => String, { nullable: true })
  search?: string;
}
