export async function ping(
  ctx: Context,
  next: () => Promise<any>
): Promise<any> {
  ctx.response.status = 200

  ctx.set('Cache-Control', 'no-cache, no-store')
  ctx.set('pragma', 'no-cache, no-store')

  ctx.response.body = `Ping check`

  await next()
}
