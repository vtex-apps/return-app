import { CRON } from '../../utils/constants'
import { formatError } from '../../utils/formatError'

export async function deleteScheduler(ctx: Context, next: () => Promise<any>) {
    const {
      clients: { scheduler },
      vtex: { logger },
    } = ctx
  
    try {
      await scheduler.deleteScheduler(CRON.id)
  
      ctx.status = 200
      ctx.body = 'Cron deleted'
  
      await next()
    } catch (e) {
      logger.error({
        middleware: 'DELETE SELLER CRON',
        message: 'Error while deleting cron',
        error: formatError(e),
      })
  
      ctx.status = 500
    }
  }