import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { Faculty } from '@faculty/models/faculty.model';
import { LearningPath } from '@learning-path/models/learning-path.model';
import { Review } from '@review/models/review.model';
import { Teacher } from '@teacher/models/teacher.model';
import { Course } from './models/course.model';

import { LearningPathFindManyArgs } from '@learning-path/dto/args';
import { ReviewFindManyArgs } from '@review/dto/args';
import { CourseFindManyArgs, CourseFindUniqueArgs } from './dto/args';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(args: CourseFindUniqueArgs) {
    const course = this.prisma.course.findUnique(args);
    return course;
  }

  async findMany(args: CourseFindManyArgs): Promise<Course[]> {
    const courses = this.prisma.course.findMany(args);
    return courses;
  }

  async teacher(course: Course): Promise<Teacher> {
    const teacher = await this.prisma.course
      .findUnique({
        where: {
          id: course.id,
        },
      })
      .teacher();

    return teacher;
  }

  async faculty(course: Course): Promise<Faculty> {
    const faculty = await this.prisma.course
      .findUnique({
        where: {
          id: course.id,
        },
      })
      .faculty();

    return faculty;
  }

  async learningPaths(
    course: Course,
    args: LearningPathFindManyArgs,
  ): Promise<LearningPath[]> {
    const learningPaths = await this.prisma.course
      .findUnique({
        where: {
          id: course.id,
        },
      })
      .learningPaths(args);

    return learningPaths;
  }

  async reviews(course: Course, args: ReviewFindManyArgs): Promise<Review[]> {
    const reviews = await this.prisma.course
      .findUnique({
        where: {
          id: course.id,
        },
      })
      .reviews();

    return reviews;
  }
}
