import { CourseLevel } from '@prisma/client';

export type CoursesPageData = {
  slug: string;
  title: string;
  learningPaths: {
    slug: string;
    title: string;
    description: string;
    url: string;
    badgeUrl: string;
    isSchool: boolean;
    courses: {
      slug: string;
      url: string;
    }[];
  }[];
}[];

export type ProcessedCoursePageData = {
  slug: string;
  url: string;
  faculty: {
    connect: { slug: string };
  };
  learningPaths: {
    connect: { slug: string }[];
  };
};

export type ScrapedCourseInfo = {
  title: string;
  description: string;
  goals: string[];
  badgeUrl: string;
  level: CourseLevel;
  expectedReviews: number;
  teacher: {
    username: string;
    name: string;
    description: string;
    url: string;
    avatarUrl: string;
  };
};

export type PreparedCourseInfo = {
  slug: string;
  title: string;
  description: string;
  goals: string[];
  badgeUrl: string;
  url: string;
  level: CourseLevel;
  expectedReviews: number;
  teacher: {
    username: string;
    name: string;
    description: string;
    url: string;
    avatarUrl: string;
  };
  faculty: {
    connect: { slug: string };
  };
  learningPaths: {
    connect: { slug: string }[];
  };
};

export type BatchExecuteConfig = {
  batchSize?: number;
  delayBetweenBatches?: number;
  maxRetries?: number;
  delayBetweenRetries?: number;
};
