import { SchedulerRequestMethods } from '../../typings/scheduler'
import { CRON } from '../../utils/constants'
import { formatError } from '../../utils/formatError'
import { getSettings } from '../../utils/settings'

export async function createScheduler(ctx: Context, next: () => Promise<any>) {
    const {
      clients: { scheduler },
      vtex: { logger },
    } = ctx
  
    try {
      let settings = await getSettings(ctx)
      await scheduler.createOrUpdateScheduler({
        cronId: settings.cronId,
        cronExpression: CRON.expression,
        request: {
          uri: CRON.url(ctx.host),
          method: SchedulerRequestMethods.GET,
          body: {
            token: settings.authToken,
            }
        },
      })
  
      ctx.status = 201
      ctx.body = 'Cron created'
  
      await next()
    } catch (e) {
      logger.error({
        middleware: 'CREATE RETURN APP SCHEDULER CRON',
        message: 'Error while creating cron',
        error: formatError(e),
      })
  
      ctx.status = 500
    }
  }