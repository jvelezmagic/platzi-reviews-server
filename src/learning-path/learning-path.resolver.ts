import { Resolver } from '@nestjs/graphql';
import { LearningPathService } from './learning-path.service';

@Resolver()
export class LearningPathResolver {
  constructor(private readonly learningPathService: LearningPathService) {}
}
