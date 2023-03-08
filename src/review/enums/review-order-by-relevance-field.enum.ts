import { registerEnumType } from '@nestjs/graphql';

export enum ReviewOrderByRelevanceFieldEnum {
  id = 'id',
  reviewerUsername = 'reviewerUsername',
  courseSlug = 'courseSlug',
  content = 'content',
}

registerEnumType(ReviewOrderByRelevanceFieldEnum, {
  name: 'ReviewOrderByRelevanceFieldEnum',
  description: undefined,
});
