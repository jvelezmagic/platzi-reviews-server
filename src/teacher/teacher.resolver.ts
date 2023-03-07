import { Resolver } from '@nestjs/graphql';
import { TeacherService } from './teacher.service';

@Resolver()
export class TeacherResolver {
  constructor(private readonly teacherService: TeacherService) {}
}
