import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { TeacherService } from './teacher.service';

import { Course } from '@course/models/course.model';
import { Teacher } from './models/teacher.model';

import { CourseFindManyArgs } from '@course/dto/args';
import { TeacherFindManyArgs, TeacherFindUniqueArgs } from './dto/args';

@Resolver((of) => Teacher)
export class TeacherResolver {
  constructor(private readonly teacherService: TeacherService) {}

  @Query((returns) => Teacher, {
    nullable: true,
    name: 'teacher',
    description: undefined,
  })
  async findUnique(@Args() args: TeacherFindUniqueArgs): Promise<Teacher> {
    return this.teacherService.findUnique(args);
  }

  @Query((returns) => [Teacher], {
    nullable: false,
    name: 'teachers',
    description: undefined,
  })
  async findMany(@Args() args: TeacherFindManyArgs): Promise<Teacher[]> {
    return this.teacherService.findMany(args);
  }

  @ResolveField((returns) => [Course], {
    nullable: false,
    name: 'courses',
    description: undefined,
  })
  async courses(
    @Parent() teacher: Teacher,
    @Args() args: CourseFindManyArgs,
  ): Promise<Course[]> {
    return this.teacherService.courses(teacher, args);
  }
}
