import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { LearningPathService } from './learning-path.service';

import { Course } from '@course/models/course.model';
import { Faculty } from '@faculty/models/faculty.model';
import { LearningPath } from './models/learning-path.model';

import { CourseFindManyArgs } from '@course/dto/args';
import {
  LearningPathFindManyArgs,
  LearningPathFindUniqueArgs,
} from './dto/args';

@Resolver((of) => LearningPath)
export class LearningPathResolver {
  constructor(private readonly learningPathService: LearningPathService) {}

  @Query((returns) => LearningPath, {
    nullable: true,
    name: 'learningPath',
    description: undefined,
  })
  async findUnique(
    @Args() args: LearningPathFindUniqueArgs,
  ): Promise<LearningPath> {
    return this.learningPathService.findUnique(args);
  }

  @Query((returns) => [LearningPath], {
    nullable: false,
    name: 'learningPaths',
    description: undefined,
  })
  async findMany(
    @Args() args: LearningPathFindManyArgs,
  ): Promise<LearningPath[]> {
    return this.learningPathService.findMany(args);
  }

  @ResolveField((returns) => [Course], {
    nullable: false,
    name: 'courses',
    description: undefined,
  })
  async courses(
    @Parent() learningPath: LearningPath,
    args: CourseFindManyArgs,
  ): Promise<Course[]> {
    return this.learningPathService.courses(learningPath, args);
  }

  @ResolveField((returns) => Faculty, {
    nullable: false,
    name: 'faculty',
    description: undefined,
  })
  async faculty(@Parent() learningPath: LearningPath): Promise<Faculty> {
    return this.learningPathService.faculty(learningPath);
  }
}
