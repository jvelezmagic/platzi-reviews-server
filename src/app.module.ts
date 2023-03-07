import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from 'nestjs-prisma';

import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs';
import { GraphQLModule } from '@nestjs/graphql';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlatziScraperModule } from './platzi-scraper/platzi-scraper.module';

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
    GraphQLModule.forRoot<YogaDriverConfig>({
      driver: YogaDriver,
      autoSchemaFile: 'schema.gql',
    }),
    PlatziScraperModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
