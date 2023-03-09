import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from 'nestjs-prisma';

import { EnvelopArmorPlugin } from '@escape.tech/graphql-armor';
import { useHive } from '@graphql-hive/client';
import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs';
import { GraphQLModule } from '@nestjs/graphql';

import { RapidApiGuard } from '@common/guards/rapid-api.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PlatziScraperModule } from './platzi-scraper/platzi-scraper.module';

import { CommonModule } from './common/common.module';
import { CourseModule } from './course/course.module';
import { FacultyModule } from './faculty/faculty.module';
import { LearningPathModule } from './learning-path/learning-path.module';
import { ReviewModule } from './review/review.module';
import { ReviewerModule } from './reviewer/reviewer.module';
import { TeacherModule } from './teacher/teacher.module';

import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ScheduleModule.forRoot(),
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync<YogaDriverConfig>({
      driver: YogaDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: 'schema.gql',
        graphiql: true,
        maskedErrors: true,
        plugins: [
          useHive({
            enabled: configService.get<boolean>('hive.enabled'),
            debug: configService.get<boolean>('hive.debug'),
            token: configService.get<string>('hive.token'),
            usage: true,
          }),
          EnvelopArmorPlugin(),
        ],
      }),
    }),
    PlatziScraperModule,
    CommonModule,
    CourseModule,
    FacultyModule,
    LearningPathModule,
    ReviewModule,
    ReviewerModule,
    TeacherModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RapidApiGuard,
    },
  ],
})
export class AppModule {}
