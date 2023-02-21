export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  node_env: process.env.NODE_ENV || 'development',

  scraper: {
    cronExpression: process.env.SCRAPER_CRON_EXPRESSION || '0 3 * * 1',
    coursesBatchConfig: {
      batchSize: parseInt(process.env.SCRAPER_COURSES_BATCH_SIZE, 10) || 50,
      delayBetweenBatches:
        parseInt(process.env.SCRAPER_COURSES_BATCH_DELAY, 10) || 1000,
      maxRetries: parseInt(process.env.SCRAPER_COURSES_MAX_RETRIES, 10) || 3,
      delayBetweenRetries:
        parseInt(process.env.SCRAPER_COURSES_DELAY_BETWEEN_RETRIES, 10) ||
        30000,
    },
    reviewsBatchConfig: {
      batchSize: parseInt(process.env.SCRAPER_REVIEWS_BATCH_SIZE, 10) || 10,
      delayBetweenBatches:
        parseInt(process.env.SCRAPER_REVIEWS_BATCH_DELAY, 10) || 1000,
      maxRetries: parseInt(process.env.SCRAPER_REVIEWS_MAX_RETRIES, 10) || 3,
      delayBetweenRetries:
        parseInt(process.env.SCRAPER_REVIEWS_DELAY_BETWEEN_RETRIES, 10) ||
        30000,
    },
  },
});
