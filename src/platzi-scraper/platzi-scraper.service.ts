import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CourseLevel, Prisma } from '@prisma/client';
import axios from 'axios';
import cheerio from 'cheerio';
import { CronJob } from 'cron';
import slugify from 'slugify';

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
    this.logger.log('Initializing Platzi Scraper');
    const cronExpression = this.configService.get<string>(
      'scraper.cron_expression',
    );

    this.logger.log(`Cron expression: ${cronExpression}`);

    const job = new CronJob(cronExpression, this.scrapePlatzi.bind(this));

    this.schedulerRegistry.addCronJob('platzi-scraper', job);

    job.start();

    this.logger.log('Platzi Scraper initialized');
  }

  async scrapePlatzi() {
    this.logger.log('Scraping (START)');
    const coursesPageData = await this.scrapeMainCoursesPage();

    await this.saveFacultiesAndLearningPaths(coursesPageData);

    const processedCoursePageData =
      this.prepareCoursesPageDataForCourseScraping(coursesPageData);

    let errorsCourseCount = 0;
    let processedCourseCount = 0;
    const forceAll = this.configService.get<boolean>('scraper.force_all');
    for await (const coursePageData of processedCoursePageData) {
      const {
        courseSlug,
        courseUrl,
        facultyConnection,
        learningPathsConnection,
      } = coursePageData;
      if (!forceAll) {
        const course = await this.prisma.course.findUnique({
          where: { slug: courseSlug },
          select: { areReviewsAlreadyScraped: true },
        });

        if (course && course.areReviewsAlreadyScraped) {
          this.logger.log(
            `Skipping - Course: ${courseSlug} - Already exists in DB`,
          );
          continue;
        }
      }

      const maxRetries = this.configService.get<number>(
        'scraper.max_retries_per_course',
      );
      let retries = 0;
      while (retries < maxRetries) {
        try {
          const courseData = await this.scrapeCourse(courseUrl);
          if (!courseData) {
            errorsCourseCount++;
            break;
          }

          const { reviews, teacher, ...course } = courseData;

          this.logger.log(`Saving - Course: ${courseSlug}`);
          let totalReviews = 0;

          const newReviewsCount = await this.prisma.$transaction(
            async (tx) => {
              await tx.teacher.upsert({
                where: { username: teacher.username },
                update: teacher,
                create: { ...teacher },
              });

              await tx.course.upsert({
                where: { slug: courseSlug },
                update: {
                  url: courseUrl,
                  ...course,
                  areReviewsAlreadyScraped: true,
                  faculty: facultyConnection,
                  learningPaths: learningPathsConnection,
                  teacher: { connect: { username: teacher.username } },
                },
                create: {
                  slug: courseSlug,
                  url: courseUrl,
                  ...course,
                  faculty: facultyConnection,
                  learningPaths: learningPathsConnection,
                  teacher: { connect: { username: teacher.username } },
                  areReviewsAlreadyScraped: true,
                },
              });

              await tx.reviewer.createMany({
                data: reviews.map((review) => ({
                  username: review.username,
                  name: review.name,
                  avatarUrl: review.avatarUrl,
                })),
                skipDuplicates: true,
              });

              const newReviewsCount = await tx.review.createMany({
                data: reviews.map((review) => ({
                  reviewerUsername: review.username,
                  courseSlug: courseSlug,
                  content: review.content,
                  rating: review.rating,
                })),
                skipDuplicates: true,
              });

              new Promise((resolve) => {
                setTimeout(
                  resolve,
                  this.configService.get<number>(
                    'scraper.delay_between_courses',
                  ),
                );
              });

              return newReviewsCount;
            },
            {
              isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
              timeout: 40000,
              maxWait: 40000,
            },
          );

          processedCourseCount++;
          totalReviews += newReviewsCount.count;

          this.logger.log(
            `Saved - Course: ${courseSlug} - Reviews: ${totalReviews}`,
          );
          break;
        } catch (error) {
          this.logger.error(error);
          retries++;
          this.logger.log(
            `Retrying - Course: ${courseSlug} - Retry: ${retries}`,
          );

          if (retries === maxRetries) {
            this.logger.error(
              `Error - Course: ${courseSlug} - Max retries reached`,
            );

            errorsCourseCount++;
            break;
          }

          await new Promise((resolve) => {
            setTimeout(
              resolve,
              this.configService.get<number>(
                'scraper.reviews_delay_between_retries',
              ),
            );
          });
        }
      }

      this.logger.log(
        `Scraping (END) - Processed: ${processedCourseCount} - Errors: ${errorsCourseCount}`,
      );
    }

    this.logger.log(
      `Scraping (END) - Processed: ${processedCourseCount} - Errors: ${errorsCourseCount}`,
    );

    this.logger.log('Scraping (END)');

    return true;
  }

  async saveFacultiesAndLearningPaths(faculties: CoursesPageData) {
    this.logger.log('=== Saving faculties and learning paths ===');
    try {
      for await (const faculty of faculties) {
        const { title, slug, learningPaths } = faculty;

        this.logger.log(`=== Saving faculty ${title} ===`);

        const facultyData = { slug, title };
        const upsertData = {
          where: { slug },
          update: facultyData,
          create: { ...facultyData },
        } satisfies Prisma.FacultyUpsertArgs;

        await this.prisma.faculty.upsert(upsertData);

        for await (const learningPath of learningPaths) {
          const { title, slug, description, url, badgeUrl, isSchool } =
            learningPath;
          this.logger.log(`=== Saving learning path ${title} ===`);

          const learningPathData = {
            slug,
            title,
            description,
            url,
            badgeUrl,
            isSchool,
            faculty: { connect: { slug: faculty.slug } },
          };

          const upsertData = {
            where: { slug },
            update: learningPathData,
            create: { ...learningPathData },
          } satisfies Prisma.LearningPathUpsertArgs;

          await this.prisma.learningPath.upsert(upsertData);

          this.logger.log(`=== Saving learning path ${title} END ===`);
        }

        this.logger.log(`=== Saving faculty ${title} END ===`);
      }

      this.logger.log('=== Saving faculties and learning paths DONE ===');
    } catch (error) {
      this.logger.error(error);
      return false;
    }

    return true;
  }

  async scrapeCourse(courseUrl: string) {
    this.logger.log(`Scraping (START) - Course: ${courseUrl}`);
    const { data } = await axios.get(courseUrl).catch((err) => {
      this.logger.error(err);
      this.logger.error(`Scraping (ERROR) - Course: ${courseUrl}`);
      return null;
    });
    const $ = cheerio.load(data);

    const title = $('.Hero-content-title').text().trim();
    const description = $('.Hero-content-description').text().trim();

    const goals: string[] = $('.Hero-content-bullets li')
      .map((_, goal) => $(goal).text().trim())
      .get();

    const badgeUrl = $('.Hero-badge img').attr('src');

    const level = $('.CourseExtraInfo-content-level-text').text().trim();

    const levelMap = {
      básico: CourseLevel.BASICO,
      intermedio: CourseLevel.INTERMEDIO,
      avanzado: CourseLevel.AVANZADO,
    };

    const expectedReviewCount =
      parseInt($('.CourseExtraInfo-content-opinions').text().trim(), 10) || 0;

    const teacher = await this.scrapeCourseTeacher($);

    const reviews = await this.scrapeAllCourseReviews(
      `${courseUrl.replace('www.', '')}opiniones/`,
    );
    this.logger.log(`Scraping (END) - Course: ${courseUrl}`);
    return {
      title,
      description,
      goals,
      badgeUrl,
      level: levelMap[level] as CourseLevel,
      expectedReviews: expectedReviewCount,
      teacher,
      reviews,
    };
  }

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

  async scrapeMainCoursesPage(): Promise<CoursesPageData> {
    this.logger.log('Scraping (START) - Main courses page');
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
    this.logger.log('Scraping (END) - Main courses page');

    return coursesPageData;
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
              courseSlug,
              courseUrl: url,
              facultyConnection: { connect: { slug: facultySlug } },
              learningPathsConnection: {
                connect: [{ slug: learningPathSlug }],
              },
            };
            result.push(processedCourses[courseSlug]);
          }
          processedCourses[courseSlug].learningPathsConnection.connect.push({
            slug: learningPathSlug,
          });
        });
      });
    });

    return result;
  }

  async scrapeAllCourseReviews(url: string) {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const totalPages = this.findTotalReviewPages($);

    const batches = Array.from({ length: totalPages }, (_, i) => i + 1);
    const batchesOfSize = batches.reduce((acc, batch, i) => {
      if (
        i %
          this.configService.get<number>('scraper.reviews_pages_batch_size') ===
        0
      ) {
        acc.push([batch]);
      } else {
        acc[acc.length - 1].push(batch);
      }
      return acc;
    }, [] as number[][]);

    const workerData = batchesOfSize.map((batch) => ({
      url,
      batch,
    }));

    const reviews_all = [];
    for await (const data of workerData) {
      const { url, batch } = data;
      const reviews = await Promise.all<
        {
          name: string;
          username: string;
          avatarUrl: string;
          content: string;
          rating: number;
        }[]
      >(
        batch.map(async (page) => {
          const pageUrl = `${url}${page}/`;
          const reviews = await this.scrapeCourseReviewsOnPage(pageUrl);
          return reviews;
        }),
      );
      reviews_all.push(reviews);

      new Promise((resolve) =>
        setTimeout(
          resolve,
          this.configService.get<number>('scraper.reviews_pages_batch_delay'),
        ),
      );
    }

    const output_reviews: {
      name: string;
      username: string;
      avatarUrl: string;
      content: string;
      rating: number;
    }[] = reviews_all.flat(2);

    return output_reviews;
  }

  findTotalReviewPages($: cheerio.Root): number {
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
    this.logger.log(`=== Scraping (START - REVIEWS) at ${url} ===`);
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const reviewCards = $('article.ReviewCard');
    const reviews = await Promise.all(
      reviewCards
        .map((_, reviewCard) => {
          const review = this.extractReviewInfo($(reviewCard));
          return review;
        })
        .get(),
    );
    this.logger.log(`=== Scraping (END - REVIEWS) at ${url} ===`);
    return reviews;
  }

  extractReviewInfo(reviewCard: cheerio.Cheerio) {
    return {
      name: reviewCard.find('h3.ReviewCard-name').text().trim(),
      username: reviewCard
        .find('a.ReviewCard-username')
        .text()
        .trim()
        .replace('@', ''),
      avatarUrl: reviewCard.find('img').attr('src'),
      content: reviewCard.find('p.ReviewCard-description').text().trim(),
      rating: reviewCard.find('svg.Stars-icon--active').length,
    };
  }
}
