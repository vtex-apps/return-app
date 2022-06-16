export async function getOrders(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { returnApp: returnAppClient },
    vtex: { logger },
  } = ctx

  const { where } = ctx.vtex.route.params

  const clientEmail = where.slice(
    where.indexOf('clientEmail='),
    where.indexOf('&')
  ) as string

  const encodedClientEmail = encodeURIComponent(
    where.slice(where.indexOf('clientEmail='), where.indexOf('&')) as string
  )

  const whereWithEncodedClientEmail =
    typeof where === 'string'
      ? where.replace(clientEmail, encodedClientEmail)
      : where[0].replace(clientEmail, encodedClientEmail)

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
