export const CRON = {
    id: '2943b02a-fd27-47e3-9fcc-9eb00e07e2a0',
    authToken: '52843179-97f4-4e49-b716-1ecf58809838',
    url: (host: string) => `https://${host}/returns/ping`,
    expression: '*/5 * * * *', // run cron every 5 minutes
  }