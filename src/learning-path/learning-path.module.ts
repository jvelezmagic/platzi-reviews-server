import { Module } from '@nestjs/common';
import { LearningPathService } from './learning-path.service';
import { LearningPathResolver } from './learning-path.resolver';

@Module({
  providers: [LearningPathResolver, LearningPathService]
})
export class LearningPathModule {}
