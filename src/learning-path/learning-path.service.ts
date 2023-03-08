import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { Course } from '@course/models/course.model';
import { Faculty } from '@faculty/models/faculty.model';
import { LearningPath } from './models/learning-path.model';

import { CourseFindManyArgs } from '@course/dto/args';
import {
  LearningPathFindManyArgs,
  LearningPathFindUniqueArgs,
} from './dto/args';

@Injectable()
export class LearningPathService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(args: LearningPathFindUniqueArgs): Promise<LearningPath> {
    const learningPath = await this.prisma.learningPath.findUnique(args);
    return learningPath;
  }

  async findMany(args: LearningPathFindManyArgs): Promise<LearningPath[]> {
    const learningPaths = await this.prisma.learningPath.findMany(args);
    return learningPaths;
  }

  async courses(
    learningPath: LearningPath,
    args: CourseFindManyArgs,
  ): Promise<Course[]> {
    const courses = await this.prisma.learningPath
      .findUnique({
        where: {
          id: learningPath.id,
        },
      })
      .courses(args);

    return courses;
  }

  async faculty(learningPath: LearningPath): Promise<Faculty> {
    const faculty = await this.prisma.learningPath
      .findUnique({
        where: {
          id: learningPath.id,
        },
      })
      .faculty();

    return faculty;
  }
}
