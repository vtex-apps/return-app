import { json } from 'co-body'
import { getSettings } from '../../utils/settings'

export async function isAdminAuthenticated(
  ctx: Context,
  next: () => Promise<any>
) {
    interface CtxObject {token: string }
    try {
      const {token}: CtxObject = await json(ctx.req)

      let settings = await getSettings(ctx)

    if (token !== settings.authToken) {
          ctx.status = 401

          return
        }

      await next()
    } catch (e) {
      ctx.vtex.logger.error({
        middleware: 'VALIDATE-CRON-TOKEN',
        message: 'Error while validating token',
        error: e,
      })

      ctx.status = 500
    }
}
