export async function ping(ctx: Context, next: () => Promise<any>) {
    ctx.vtex.logger.info({
      middleware: 'PING',
      message: 'Pinged',
    })
    ctx.set('Cache-Control', 'no-store')
    ctx.status = 200
    await next()
  }