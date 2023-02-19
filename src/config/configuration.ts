export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  node_env: process.env.NODE_ENV || 'development',
  scraper: {
    cron_expression: process.env.SCRAPER_CRON_EXPRESSION || '0 3 * * 1',
    force_all: Boolean(process.env.SCRAPER_FORCE_ALL) || true,
    reviews_pages_batch_size:
      parseInt(process.env.SCRAPER_REVIEWS_PAGES_BATCH_SIZE, 10) || 50,
    reviews_pages_batch_delay:
      parseInt(process.env.SCRAPER_REVIEWS_PAGES_BATCH_DELAY, 10) || 1000,
    max_retries_per_course:
      parseInt(process.env.SCRAPER_MAX_RETRIES_PER_COURSE, 10) || 3,
    delay_between_retries:
      parseInt(process.env.SCRAPER_DELAY_BETWEEN_RETRIES, 10) || 30000,
    delay_between_courses:
      parseInt(process.env.SCRAPER_DELAY_BETWEEN_COURSES, 10) || 5000,
  },
});
