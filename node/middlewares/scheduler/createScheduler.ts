import { SchedulerRequestMethods } from '../../typings/scheduler'
import { CRON } from '../../utils/constants'
import { formatError } from '../../utils/formatError'

export async function createScheduler(ctx: Context, next: () => Promise<any>) {
    const {
      clients: { scheduler },
      vtex: { logger },
    } = ctx
  
    try {
      await scheduler.createOrUpdateScheduler({
        cronId: CRON.id,
        cronExpression: CRON.expression,
        request: {
          uri: CRON.url(ctx.host),
          method: SchedulerRequestMethods.POST,
          body: {
            "cron": "PingScheduler"
            }
        },
      })
  
      ctx.status = 201
      ctx.body = 'Cron created'
  
      await next()
    } catch (e) {
      logger.error({
        middleware: 'CREATE SELLER ACCOUNT NAME CRON',
        message: 'Error while creating cron',
        error: formatError(e),
      })
  
      ctx.status = 500
    }
  }