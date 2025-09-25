export async function keepAlive(ctx: Context, next: () => Promise<any>) {
  console.info('Keep Alive running', process.env.VTEX_APP_ID)

  ctx.status = 200
  ctx.body = 'Ok'

  ctx.set('Cache-Control', 'no-cache')

  await next()
}