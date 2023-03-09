import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { FacultyService } from './faculty.service';

import { Course } from '@course/models/course.model';
import { LearningPath } from '@learning-path/models/learning-path.model';
import { Faculty } from './models/faculty.model';

import { CourseFindManyArgs } from '@course/dto/args';
import { LearningPathFindManyArgs } from '@learning-path/dto/args';
import { FacultyFindManyArgs, FacultyFindUniqueArgs } from './dto/args';

@Resolver((of) => Faculty)
export class FacultyResolver {
  constructor(private readonly facultyService: FacultyService) {}

  @Query((returns) => Faculty, {
    nullable: true,
    name: 'faculty',
    description: undefined,
  })
  async findUnique(@Args() args: FacultyFindUniqueArgs): Promise<Faculty> {
    return this.facultyService.findUnique(args);
  }

  @Query((returns) => [Faculty], {
    nullable: false,
    name: 'faculties',
    description: undefined,
  })
  async findMany(@Args() args: FacultyFindManyArgs) {
    return this.facultyService.findMany(args);
  }

  @ResolveField((returns) => [Course], {
    nullable: false,
    name: 'courses',
    description: undefined,
  })
  async courses(
    @Parent() faculty: Faculty,
    @Args() args: CourseFindManyArgs,
  ): Promise<Course[]> {
    return this.facultyService.courses(faculty, args);
  }

  @ResolveField((returns) => [LearningPath], {
    nullable: false,
    name: 'learningPaths',
    description: undefined,
  })
  async learningPaths(
    @Parent() faculty: Faculty,
    @Args() args: LearningPathFindManyArgs,
  ): Promise<LearningPath[]> {
    return this.facultyService.learningPaths(faculty, args);
  }
}
