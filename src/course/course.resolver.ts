import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CourseService } from './course.service';

import { Faculty } from '@faculty/models/faculty.model';
import { LearningPath } from '@learning-path/models/learning-path.model';
import { Review } from '@review/models/review.model';
import { Teacher } from '@teacher/models/teacher.model';
import { Course } from './models/course.model';

import { LearningPathFindManyArgs } from '@learning-path/dto/args';
import { ReviewFindManyArgs } from '@review/dto/args';
import { CourseFindManyArgs, CourseFindUniqueArgs } from './dto/args';

@Resolver((of) => Course)
export class CourseResolver {
  constructor(private readonly courseService: CourseService) {}

  @Query((returns) => Course, {
    nullable: true,
    name: 'course',
    description: undefined,
  })
  async findUnique(@Args() args: CourseFindUniqueArgs): Promise<Course | null> {
    const course = await this.courseService.findUnique(args);
    return course;
  }

  @Query((returns) => [Course], {
    nullable: false,
    name: 'courses',
    description: undefined,
  })
  async findMany(@Args() args: CourseFindManyArgs): Promise<Course[]> {
    const courses = await this.courseService.findMany(args);
    return courses;
  }

  @ResolveField((returns) => Teacher, {
    name: 'teacher',
    nullable: false,
    description: undefined,
  })
  async teacher(@Parent() course: Course): Promise<Teacher> {
    return this.courseService.teacher(course);
  }

  @ResolveField((returns) => Faculty, {
    name: 'faculty',
    nullable: false,
    description: undefined,
  })
  async faculty(@Parent() course: Course): Promise<Faculty> {
    return this.courseService.faculty(course);
  }

  @ResolveField((returns) => [LearningPath], {
    name: 'learningPaths',
    nullable: false,
    description: undefined,
  })
  async learningPaths(
    @Parent() course: Course,
    @Args() args: LearningPathFindManyArgs,
  ): Promise<LearningPath[]> {
    return this.courseService.learningPaths(course, args);
  }

  @ResolveField((returns) => [Review], {
    nullable: false,
    name: 'reviews',
    description: undefined,
  })
  async reviews(
    @Parent() course: Course,
    @Args() args: ReviewFindManyArgs,
  ): Promise<Review[]> {
    return this.courseService.reviews(course, args);
  }
}
