import { registerEnumType } from '@nestjs/graphql';

export enum CourseLevel {
  BASICO = 'BASICO',
  INTERMEDIO = 'INTERMEDIO',
  AVANZADO = 'AVANZADO',
}

registerEnumType(CourseLevel, {
  name: 'CourseLevel',
  description: 'Course level',
  valuesMap: {
    [CourseLevel.BASICO]: {
      description: 'Course level basic',
    },
    [CourseLevel.INTERMEDIO]: {
      description: 'Course level intermediate',
    },
    [CourseLevel.AVANZADO]: {
      description: 'Course level advanced',
    },
  },
});
