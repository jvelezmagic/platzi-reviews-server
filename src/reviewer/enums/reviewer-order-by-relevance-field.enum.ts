import { registerEnumType } from '@nestjs/graphql';

export enum ReviewerOrderByRelevanceFieldEnum {
  id = 'id',
  username = 'username',
  name = 'name',
  avatartUrl = 'avatarUrl',
}

registerEnumType(ReviewerOrderByRelevanceFieldEnum, {
  name: 'ReviewerOrderByRelevanceFieldEnum',
  description: undefined,
});
