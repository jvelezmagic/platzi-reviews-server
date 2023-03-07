import { Module } from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { FacultyResolver } from './faculty.resolver';

@Module({
  providers: [FacultyResolver, FacultyService]
})
export class FacultyModule {}
