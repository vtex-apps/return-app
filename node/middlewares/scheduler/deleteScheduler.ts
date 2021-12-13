import { formatError } from '../../utils/formatError'
import { getSettings } from '../../utils/settings'

export async function deleteScheduler(ctx: Context, next: () => Promise<any>) {
    const {
      clients: { scheduler },
      vtex: { logger },
    } = ctx
  
    try {
      let settings = await getSettings(ctx)
      await scheduler.deleteScheduler(settings.cronId)
      ctx.status = 200
      ctx.body = 'Cron deleted'

      await next()
    } catch (e) {
      logger.error({
        middleware: 'DELETE RETURN APP CRON',
        message: 'Error while deleting cron',
        error: formatError(e),
      })
  
      ctx.status = 500
    }
  }