import { registerEnumType } from '@nestjs/graphql';

export enum LearningPathOrderByRelevanceFieldEnum {
  slug = 'slug',
  title = 'title',
  description = 'description',
  url = 'url',
}

registerEnumType(LearningPathOrderByRelevanceFieldEnum, {
  name: 'LearningPathOrderByRelevanceFieldEnum',
  description: undefined,
});
