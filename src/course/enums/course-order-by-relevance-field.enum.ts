import { registerEnumType } from '@nestjs/graphql';

export enum CourseOrderByRelevanceFieldEnum {
  id = 'id',
  slug = 'slug',
  title = 'title',
  description = 'description',
  goals = 'goals',
}

registerEnumType(CourseOrderByRelevanceFieldEnum, {
  name: 'CourseOrderByRelevanceFieldEnum',
  description: undefined,
});
