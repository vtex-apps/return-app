import { json } from 'co-body'
import { CRON } from '../../utils/constants'

export async function isAdminAuthenticated(
  ctx: Context,
  next: () => Promise<any>
) {
    interface CtxObject {token: string }
    try {

      const {token} : CtxObject= await json(ctx.req)

    if (token !== CRON.authToken) {
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
