export async function getOrders(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { returnApp: returnAppClient },
    vtex: { logger },
  } = ctx

  const { where } = ctx.vtex.route.params

  const whereWithEncodedClientEmail = encodeURIComponent(
    where.slice(where.indexOf('clientEmail='), where.indexOf('&')) as string
  )

  const response = await returnAppClient.getOrders(
    ctx,
    whereWithEncodedClientEmail
  )

  if (!response) {
    throw new Error(`Error getting orders`)
  }

  logger.info({
    message: 'Get orders successfully',
    data: response,
  })

  ctx.status = 200
  ctx.set('Cache-Control', 'no-cache')
  ctx.body = response

  await next()
}
