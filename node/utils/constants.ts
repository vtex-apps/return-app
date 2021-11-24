export const CRON = {
    id: '2943b02a-fd27-47e3-9fcc-9eb00e07e2a0',
    url: (host: string) => `https://${host}/returns/ping`,
    expression: '*/5 * * * *', // run cron every 5 minutes
  }