import { registerEnumType } from '@nestjs/graphql';

export enum TeacherOrderByRelevanceFieldEnum {
  id = 'id',
  username = 'username',
  name = 'name',
  description = 'description',
  url = 'url',
  avatarUrl = 'avatarUrl',
}

registerEnumType(TeacherOrderByRelevanceFieldEnum, {
  name: 'TeacherOrderByRelevanceFieldEnum',
  description: undefined,
});
