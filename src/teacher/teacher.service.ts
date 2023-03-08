import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { Course } from '@course/models/course.model';
import { Teacher } from './models/teacher.model';

import { CourseFindManyArgs } from '@course/dto/args';
import { TeacherFindManyArgs, TeacherFindUniqueArgs } from './dto/args';

@Injectable()
export class TeacherService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(args: TeacherFindUniqueArgs): Promise<Teacher> {
    const teacher = await this.prisma.teacher.findUnique(args);
    return teacher;
  }

  async findMany(args: TeacherFindManyArgs): Promise<Teacher[]> {
    const teachers = await this.prisma.teacher.findMany(args);
    return teachers;
  }

  async courses(teacher: Teacher, args: CourseFindManyArgs): Promise<Course[]> {
    const courses = await this.prisma.teacher
      .findUnique({
        where: {
          id: teacher.id,
        },
      })
      .courses(args);

    return courses;
  }
}
