import { Field, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { SortOrder } from '@common/enums';

import { FacultyOrderByRelevanceFieldEnum } from '@faculty/enums';

@InputType()
export class FacultyOrderByRelevanceInput
  implements Prisma.FacultyOrderByRelevanceInput
{
  @Field((type) => [FacultyOrderByRelevanceFieldEnum])
  fields: Array<FacultyOrderByRelevanceFieldEnum>;

  @Field((type) => SortOrder, { defaultValue: 'asc' })
  sort: keyof typeof SortOrder;

  @Field((type) => String, { nullable: true })
  search: string;
}
