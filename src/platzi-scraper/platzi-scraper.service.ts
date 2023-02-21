import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CourseLevel, Prisma } from '@prisma/client';
import axios from 'axios';
import cheerio from 'cheerio';
import { CronJob } from 'cron';
import slugify from 'slugify';

import {
  BatchExecuteConfig,
  CoursesPageData,
  PreparedCourseInfo,
  ProcessedCoursePageData,
  ScrapedCourseInfo,
} from './types';

@Injectable()
export class PlatziScraperService {
  private readonly logger = new Logger(PlatziScraperService.name);
  private readonly COURSES_URL = 'https://platzi.com/cursos/' as const;

  constructor(
    private readonly prisma: PrismaService,
    private configService: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  onModuleInit() {
    this.logger.log('=== Initializing Platzi Scraper ===');
    const cronExpression = this.configService.get<string>(
      'scraper.cronExpression',
    );

    const coursesBatchConfig = this.configService.get<BatchExecuteConfig>(
      'scraper.coursesBatchConfig',
    );

    const reviewsBatchConfig = this.configService.get<BatchExecuteConfig>(
      'scraper.reviewsBatchConfig',
    );

    const job = new CronJob(
      cronExpression,
      this.scrapePlatzi.bind(this, coursesBatchConfig, reviewsBatchConfig),
    );

    this.schedulerRegistry.addCronJob('platzi-scraper', job);

    job.start();

    this.logger.log('=== Platzi Scraper initialized ===');
  }

  async scrapePlatzi(
    coursesBatchConfig: BatchExecuteConfig = {},
    reviewsBatchConfig: BatchExecuteConfig = {},
  ) {
    this.logger.log('=== Scraping (PLATZI START) ===');
    const coursesPageData = await this.scrapeMainCoursesPage();

    await this.saveFacultiesAndLearningPaths(coursesPageData);

    const processedCoursePageData =
      this.prepareCoursesPageDataForCourseScraping(coursesPageData);

    const results = await this.scrapeAndSaveCoursesInfo(
      processedCoursePageData,
      coursesBatchConfig,
    );

    const succeded_courses = results.filter((result) => result.success);
    const failed_courses = results.filter((result) => !result.success);

    this.logger.log(
      `=== Scraping courses status === Succeded: ${succeded_courses.length} Failed: ${failed_courses.length} ===`,
    );

    let failed_courses_count = 0;
    let succeded_courses_count = 0;
    for await (const { url, slug } of succeded_courses) {
      this.logger.log(`=== Scraping (REVIEWS START): ${url} ===`);

      const reviews_url = `${url.replace('www.', '')}opiniones/`;

      const scrapeCourseReviewsStatus = await this.scrapeCourseReviews(
        reviews_url,
        slug,
        reviewsBatchConfig,
      );

      if (scrapeCourseReviewsStatus) {
        succeded_courses_count++;
      } else {
        failed_courses_count++;
      }

      this.logger.log(
        `=== Scraping (REVIEWS STATUS) === Succeded: ${succeded_courses_count} Failed: ${failed_courses_count} ===`,
      );

      this.logger.log(`=== Scraping (REVIEWS END): ${url} ===`);
    }

    this.logger.log(
      `=== Scraping (REVIEWS STATUS) === Succeded: ${succeded_courses_count} Failed: ${failed_courses_count} ===`,
    );

    this.logger.log('Scraping (PLATZI END) ===');
  }

  async scrapeCourseReviews(
    course_review_url: string,
    slug: string,
    batchConfig: BatchExecuteConfig,
  ) {
    this.logger.log(`=== Scraping (REVIEWS START) ${course_review_url} ===`);
    const totalReviewPages = await this.findTotalReviewPages(course_review_url);
    this.logger.log(`=== Scrapint (REVIEWS PAGES): ${totalReviewPages} ===`);
    const reviewPages = await this.batchExecute<number, boolean>(
      Array.from({ length: totalReviewPages }, (_, i) => i + 1),
      async (page) => {
        const url = `${course_review_url}${page}/`;
        try {
          const reviews = await this.scrapeCourseReviewsOnPage(url);

          while (true) {
            try {
              await this.prisma.reviewer.createMany({
                data: reviews.map((review) => review.reviewer),
                skipDuplicates: true,
              });

              await this.prisma.review.createMany({
                data: reviews.map((review) => ({
                  courseSlug: slug,
                  reviewerUsername: review.reviewer.username,
                  ...review.review,
                })),
                skipDuplicates: true,
              });
              break;
            } catch (error) {
              if (error.message.includes('connection pool')) {
                continue;
              }
            }
          }

          return true;
        } catch (error) {
          this.logger.log(error);
          return false;
        }
      },
      batchConfig,
    );

    // if all reviewPages are true then update course
    if (reviewPages.every((page) => page)) {
      const reviewsCount = await this.prisma.course.update({
        where: { slug },
        data: { areReviewsAlreadyScraped: true },
        select: { _count: { select: { reviews: true } } },
      });
      this.logger.log(
        `=== Scraping (REVIEWS SUCCESS): ${course_review_url} with ${reviewsCount._count.reviews} reviews ===`,
      );
      return true;
    } else {
      const reviewsCount = await this.prisma.course.update({
        where: { slug },
        data: { areReviewsAlreadyScraped: false },
        select: { _count: { select: { reviews: true } } },
      });
      this.logger.log(
        `=== Scraping (REVIEWS FAILED): ${course_review_url} with ${reviewsCount._count.reviews} ===`,
      );

      return false;
    }
  }

  async scrapeAndSaveCoursesInfo(
    processedCoursePageData: ProcessedCoursePageData[],
    batchConfig: BatchExecuteConfig = {},
  ): Promise<{ url: string; slug: string; success: boolean }[]> {
    const results = await this.batchExecute<
      ProcessedCoursePageData,
      { url: string; slug: string; success: boolean }
    >(
      processedCoursePageData,
      async (coursePageData) => {
        const { slug, url, faculty, learningPaths } = coursePageData;

        const courseData = await this.scrapeCourseInfo(url);

        if (courseData === null) {
          return {
            url,
            slug,
            success: false,
          };
        }

        while (true) {
          try {
            await this.saveCourseInfo({
              slug,
              url,
              faculty,
              learningPaths,
              ...courseData,
            });
            break;
          } catch (error) {
            if (error.message.includes('connection pool')) {
              continue;
            }
          }
        }

        return {
          url,
          slug,
          success: true,
        };
      },
      batchConfig,
    );

    return results;
  }

  async saveCourseInfo(courseInfo: PreparedCourseInfo) {
    this.logger.log(`=== Saving course info: ${courseInfo.url} ===`);
    const { teacher, ...course } = courseInfo;

    try {
      await this.prisma.teacher.upsert({
        where: { username: teacher.username },
        update: teacher,
        create: teacher,
      });

      await this.prisma.course.upsert({
        where: { slug: course.slug },
        update: course,
        create: {
          ...course,
          teacher: {
            connect: { username: teacher.username },
          },
        },
      });
      this.logger.log(`=== Saving course info: ${courseInfo.url} DONE ===`);
      return true;
    } catch (error) {
      this.logger.error(error);
      this.logger.error(`=== Saving course info: ${courseInfo.url} FAILED ===`);
      return false;
    }
  }

  async saveFacultiesAndLearningPaths(faculties: CoursesPageData) {
    this.logger.log('=== Saving (FACULTIES-LEARING-PATHS START) ===');
    try {
      await Promise.all(
        faculties.map(async (faculty) => {
          const { title, slug, learningPaths } = faculty;

          this.logger.log(`=== Saving (FACULTY START): ${title} ===`);

          while (true) {
            try {
              await this.upsertFaculty({ slug, title });
              break;
            } catch (error) {
              if (error.message.includes('connection pool')) {
                continue;
              }
            }
          }

          const learningPathUpsertPromises = learningPaths.map(
            async (learningPath) => {
              this.logger.log(
                `=== Saving (LEARNING-PATH START): ${learningPath.title} ===`,
              );

              while (true) {
                try {
                  await this.upsertLearningPath({
                    ...learningPath,
                    facultySlug: slug,
                  });
                  break;
                } catch (error) {
                  if (error.message.includes('connection pool')) {
                    continue;
                  }
                }
              }

              this.logger.log(
                `=== Saving (LEARNING-PATH END) ${learningPath.title} ===`,
              );
            },
          );

          await Promise.all(learningPathUpsertPromises);

          this.logger.log(`=== Saving (FACULTY END): ${title} ===`);
        }),
      );

      this.logger.log('=== Saving (FACULTIES-LEARING-PATHS END) ===');
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  async upsertFaculty({ slug, title }) {
    const upsertData = {
      where: { slug },
      update: { slug, title },
      create: { slug, title },
    } satisfies Prisma.FacultyUpsertArgs;

    await this.prisma.faculty.upsert(upsertData);
  }

  async upsertLearningPath({
    slug,
    title,
    description,
    url,
    badgeUrl,
    isSchool,
    facultySlug,
  }) {
    const learningPathData = {
      slug,
      title,
      description,
      url,
      badgeUrl,
      isSchool,
      faculty: { connect: { slug: facultySlug } },
    };

    const upsertData = {
      where: { slug },
      update: learningPathData,
      create: learningPathData,
    } satisfies Prisma.LearningPathUpsertArgs;

    await this.prisma.learningPath.upsert(upsertData);
  }

  prepareCoursesPageDataForCourseScraping(
    coursesPageData: CoursesPageData,
  ): ProcessedCoursePageData[] {
    const result: ProcessedCoursePageData[] = [];
    const processedCourses: Record<string, ProcessedCoursePageData> = {};

    coursesPageData.forEach(({ slug: facultySlug, learningPaths }) => {
      learningPaths.forEach(({ slug: learningPathSlug, courses }) => {
        courses.forEach(({ slug: courseSlug, url }) => {
          if (!processedCourses[courseSlug]) {
            processedCourses[courseSlug] = {
              slug: courseSlug,
              url: url,
              faculty: { connect: { slug: facultySlug } },
              learningPaths: {
                connect: [{ slug: learningPathSlug }],
              },
            };
            result.push(processedCourses[courseSlug]);
          }
          processedCourses[courseSlug].learningPaths.connect.push({
            slug: learningPathSlug,
          });
        });
      });
    });

    return result;
  }

  /*
   * Scrapes the main courses page and returns an array of faculties
   * Each faculty contains an array of learning paths
   * Each learning path contains an array of courses
   * Each course contains a slug and a url
   */
  async scrapeMainCoursesPage(): Promise<CoursesPageData> {
    this.logger.log('=== Scraping (MAIN-PAGE-COURSES START) ===');
    const { data } = await axios.get(this.COURSES_URL);
    const $ = cheerio.load(data);
    const coursesPageData = await Promise.all<CoursesPageData>(
      $('div.Categories-item')
        .map(async (_, faculty) => {
          const learningPaths = await Promise.all(
            $(faculty)
              .find('div.School')
              .map(async (_, learningPath) => {
                const href = $(learningPath).find('a').attr('href');

                const slug = href
                  .replace('/escuela/', '')
                  .replace(/^\/|\/$/g, '');

                const isSchool = href.includes('/escuela/');

                const title = $(learningPath).find('h3').text().trim();
                const description = $(learningPath).find('p').text().trim();

                const url = isSchool
                  ? `https://www.platzi.com/escuela/${slug}/`
                  : `https://www.platzi.com/ruta/${slug}/`;

                const badgeUrl = $(learningPath).find('img').attr('src');

                const courses = await Promise.all(
                  $(learningPath)
                    .find('.Course')
                    .map(async (_, course) => {
                      let slug = $(course).attr('href').split('/')[2];

                      if (/^\d+-/.test(slug)) {
                        slug = slug.replace(/^\d+-/, '');
                      }

                      const url = `https://www.platzi.com/cursos/${slug}/`;

                      return {
                        slug,
                        url,
                      };
                    }),
                );

                return {
                  slug,
                  title,
                  description,
                  url,
                  badgeUrl,
                  isSchool,
                  courses,
                };
              }),
          );

          const title = $(faculty).find('h2').text().trim();
          const slug = slugify(title, { lower: true });

          return {
            slug,
            title,
            learningPaths,
          };
        })
        .get(),
    );
    this.logger.log('=== Scraping (MAIN-PAGE-COURSES END) ===');

    return coursesPageData;
  }

  /*
   * Scrapes the course page and returns an object with the course info
   * If the course is not found, returns null
   */
  async scrapeCourseInfo(courseUrl: string): Promise<ScrapedCourseInfo | null> {
    this.logger.log(`=== Scraping (START) - Course info: ${courseUrl} ===`);
    try {
      const response = await axios.get(courseUrl).catch((error) => {
        this.logger.error(error);
        return null;
      });

      const levelMap = {
        básico: CourseLevel.BASICO,
        intermedio: CourseLevel.INTERMEDIO,
        avanzado: CourseLevel.AVANZADO,
      };

      const { data } = response;

      const $ = cheerio.load(data);

      const info = {
        title: $('.Hero-content-title').text().trim(),
        description: $('.Hero-content-description').text().trim(),
        goals: $('.Hero-content-bullets li')
          .map((_, goal) => $(goal).text().trim())
          .get(),
        badgeUrl: $('.Hero-badge img').attr('src'),
        level: levelMap[
          $('.CourseExtraInfo-content-level-text').text().trim()
        ] as CourseLevel,
        expectedReviews:
          parseInt($('.CourseExtraInfo-content-opinions').text().trim(), 10) ||
          0,
        teacher: await this.scrapeCourseTeacher($),
      };

      this.logger.log(`=== Scraping (END) - Course info: ${courseUrl} ===`);
      return info;
    } catch (error) {
      this.logger.error(error);
      this.logger.error(`=== Scraping (END) - Course info: ${courseUrl} ===`);
      return null;
    }
  }

  /*
   * Scrape the teacher info from the course page
   */
  async scrapeCourseTeacher($: cheerio.Root) {
    const username = $('.Hero-teacher-anchor')
      .attr('href')
      .replace('/profesores/', '')
      .replace('/profes/', '')
      .replace('/', '');

    const name = $('.Hero-teacher-name').text().trim();

    const description = $('.Hero-teacher-description')?.text().trim() || null;

    const url = `https://platzi.com/profes/${username}/`;

    const avatarUrl = $('.Hero-background img').attr('src');

    return {
      username,
      name,
      description,
      url,
      avatarUrl,
    };
  }

  async findTotalReviewPages(url: string): Promise<number> {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const totalPagesItem = $('li.Pagination-item--total');

    if (totalPagesItem.length === 0) {
      const totalPages = $('li.Pagination-item').filter(function () {
        return (
          !$(this).attr('class') || $(this).attr('class') === 'Pagination-item'
        );
      }).length;
      return totalPages === 0 ? 1 : totalPages;
    }

    return Number(totalPagesItem.find('a').text().trim());
  }

  async scrapeCourseReviewsOnPage(url: string) {
    this.logger.log(`=== Scraping (REVIEWS START) at ${url} ===`);
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const reviewCards = $('article.ReviewCard');
    const reviews: {
      reviewer: {
        name: string;
        username: string;
        avatarUrl: string;
      };
      review: {
        content: string;
        rating: number;
      };
    }[] = await Promise.all(
      reviewCards
        .map((_, reviewCard) => {
          const review = this.extractReviewInfo($(reviewCard));
          return review;
        })
        .get(),
    );
    this.logger.log(`=== Scraping (REVIEWS END) at ${url} ===`);
    return reviews;
  }

  extractReviewInfo(reviewCard: cheerio.Cheerio) {
    return {
      reviewer: {
        name: reviewCard.find('h3.ReviewCard-name').text().trim(),
        username: reviewCard
          .find('a.ReviewCard-username')
          .text()
          .trim()
          .replace('@', ''),
        avatarUrl: reviewCard.find('img').attr('src'),
      },
      review: {
        content: reviewCard.find('p.ReviewCard-description').text().trim(),
        rating: reviewCard.find('svg.Stars-icon--active').length,
      },
    };
  }

  async batchExecute<T, R>(
    args: T[],
    func: (...args: T[]) => Promise<R>,
    config: BatchExecuteConfig = {},
  ): Promise<R[]> {
    const batchSize = config.batchSize || 10;
    const delayBetweenBatches = config.delayBetweenBatches || 1000;
    const maxRetries = config.maxRetries || 3;
    const delayBetweenRetries = config.delayBetweenRetries || 1000;
    const results: R[] = [];
    const errors: Error[] = [];

    const batches = await this.chunk(args, batchSize);

    for (const batch of batches) {
      const batchResults = await Promise.all(
        batch.map(async (arg) => {
          let retries = 0;
          let result: R | null = null;
          while (retries < maxRetries) {
            try {
              result = await func(arg);
              break;
            } catch (error) {
              this.logger.error(error);
              retries++;
              await new Promise((resolve) =>
                setTimeout(resolve, delayBetweenRetries),
              );
            }
          }
          if (result === null) {
            errors.push(new Error('Max retries reached'));
          }
          return result;
        }),
      );

      results.push(...batchResults);
      await new Promise((resolve) => setTimeout(resolve, delayBetweenBatches));
    }

    if (errors.length > 0) {
      this.logger.error(errors);
    }

    return results;
  }

  async chunk<T>(array: T[], chunkSize: number): Promise<T[][]> {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
}
