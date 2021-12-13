export const CRON = {
    url: (host: string) => `https://${host}/returns/ping`,
    expression: '*/5 * * * *', // run cron every 5 minutes
  }