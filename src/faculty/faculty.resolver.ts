import { Resolver } from '@nestjs/graphql';
import { FacultyService } from './faculty.service';

@Resolver()
export class FacultyResolver {
  constructor(private readonly facultyService: FacultyService) {}
}
