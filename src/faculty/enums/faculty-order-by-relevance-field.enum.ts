import { registerEnumType } from '@nestjs/graphql';

export enum FacultyOrderByRelevanceFieldEnum {
  id = 'id',
  slug = 'slug',
  title = 'title',
}

registerEnumType(FacultyOrderByRelevanceFieldEnum, {
  name: 'FacultyOrderByRelevanceFieldEnum',
  description: undefined,
});
