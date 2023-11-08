import type { EventContext } from '@vtex/api'

import type { Clients } from '../clients'
import { schedulerTemplate } from '../config/schedulerTemplate'

const setupScheduler = async (ctx: EventContext<Clients>) => {
  const {
    clients: { scheduler },
    body: { to, from },
    vtex: { logger, production },
  } = ctx

  if (production !== true) {
    logger.info({
      message: 'setup-scheduler-not-production',
      data: `production: ${production}`,
    })

    return true
  }

  if (to) {
    const [appName] = to?.id?.split('@')

    if (
      appName.length &&
      `${process.env.VTEX_APP_VENDOR}.${process.env.VTEX_APP_NAME}` === appName
    ) {
      const schedulerPingRequest: SchedulerRequest = schedulerTemplate

      schedulerPingRequest.id = 'return-app-ping'
      schedulerPingRequest.request.uri = `https://${ctx.vtex.workspace}--${ctx.vtex.account}.myvtex.com/_v/return-app/ping`
      schedulerPingRequest.request.method = 'POST'
      schedulerPingRequest.request.headers = {
        'cache-control': 'no-store',
        pragma: 'no-store',
      }
      schedulerPingRequest.scheduler.expression = '*/1 * * * *'
      schedulerPingRequest.scheduler.endDate = '2100-01-01T23:30:00'

      try {
        await scheduler.createlScheduler(appName, schedulerPingRequest)
        logger.info({
          message: 'create-scheduler-return-app-ping',
        })
      } catch (error) {
        logger.error({
          message: 'error-create-scheduler-return-app-ping',
          error,
        })
      }

      return true
    }
  } else if (from) {
    const [appName] = from?.id?.split('@')

    if (
      appName.length &&
      `${process.env.VTEX_APP_VENDOR}.${process.env.VTEX_APP_NAME}` === appName
    ) {
      const idName = 'return-app-ping'

      try {
        await scheduler.deleteScheduler(appName, idName)
        logger.info({
          message: 'delete-scheduler-return-app-ping',
        })
      } catch (error) {
        logger.error({
          message: 'error-delete-scheduler-return-app-ping',
          error,
        })
      }

      return true
    }
  }

  return null
}

export default setupScheduler
