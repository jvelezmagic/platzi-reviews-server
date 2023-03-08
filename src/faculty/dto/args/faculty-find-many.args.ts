import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { IsOptional, Max, Min } from 'class-validator';

import {
  FacultyOrderByInput,
  FacultyWhereInput,
  FacultyWhereUniqueInput,
} from '../inputs';

@ArgsType()
export class FacultyFindManyArgs implements Prisma.FacultyFindManyArgs {
  @Field((type) => FacultyWhereInput, { nullable: true })
  where?: FacultyWhereInput;

  @Field((type) => [FacultyOrderByInput], { nullable: true })
  orderBy?: FacultyOrderByInput[];

  @Field((type) => FacultyWhereUniqueInput, { nullable: true })
  cursor?: FacultyWhereUniqueInput;

  @Field((type) => Int, { nullable: true, name: 'take', defaultValue: 10 })
  @Max(8)
  @Min(1)
  @IsOptional()
  take?: number;

  @Field((type) => Int, { nullable: true, name: 'skip', defaultValue: 0 })
  @Min(0)
  @IsOptional()
  skip?: number;
}
