import { CommonLogger } from '../utils/commonLogger'

export async function keepAlive(ctx: Context, next: () => Promise<any>) {
  // Log keep alive check (minimal logging for health check)
  CommonLogger.logApiOperation(ctx, 'keepAlive', {}, { 
    file: 'middlewares/keepAlive.ts', 
    function: 'keepAlive' 
  })

  ctx.status = 200
  ctx.body = 'Ok'
  ctx.set('Cache-Control', 'no-cache')

  await next()
}