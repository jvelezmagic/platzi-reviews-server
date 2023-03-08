import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { Course } from '@course/models/course.model';
import { LearningPath } from '@learning-path/models/learning-path.model';
import { Faculty } from './models/faculty.model';

import { CourseFindManyArgs } from '@course/dto/args';
import { LearningPathFindManyArgs } from '@learning-path/dto/args';
import { FacultyFindManyArgs, FacultyFindUniqueArgs } from './dto/args';

@Injectable()
export class FacultyService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(args: FacultyFindUniqueArgs): Promise<Faculty> {
    const faculty = await this.prisma.faculty.findUnique(args);
    return faculty;
  }

  async findMany(args: FacultyFindManyArgs): Promise<Faculty[]> {
    const faculties = await this.prisma.faculty.findMany(args);
    return faculties;
  }

  async courses(faculty: Faculty, args: CourseFindManyArgs): Promise<Course[]> {
    const courses = await this.prisma.faculty
      .findUnique({
        where: {
          id: faculty.id,
        },
      })
      .courses(args);

    return courses;
  }

  async learningPaths(
    faculty: Faculty,
    args: LearningPathFindManyArgs,
  ): Promise<LearningPath[]> {
    const learningPaths = await this.prisma.faculty
      .findUnique({
        where: {
          id: faculty.id,
        },
      })
      .learningPaths(args);

    return learningPaths;
  }
}
