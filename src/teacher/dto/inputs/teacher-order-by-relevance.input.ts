import { Field, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { SortOrder } from '@common/enums';

import { TeacherOrderByRelevanceFieldEnum } from '@teacher/enums';

@InputType()
export class TeacherOrderByRelevanceInput
  implements Prisma.TeacherOrderByRelevanceInput
{
  @Field((type) => [TeacherOrderByRelevanceFieldEnum])
  fields: Array<TeacherOrderByRelevanceFieldEnum>;

  @Field((type) => SortOrder, { defaultValue: 'asc' })
  sort: keyof typeof SortOrder;

  @Field((type) => String, { nullable: true })
  search: string;
}
