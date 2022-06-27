export async function getOrders(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { returnApp: returnAppClient },
    vtex: { logger },
  } = ctx

  const { where } = ctx.vtex.route.params as { where: string }

  const clientEmailKey = 'clientEmail'

  const indexOfClientEmail = where.indexOf(clientEmailKey)

  const nextParam = where.indexOf('&', indexOfClientEmail)

  const clientEmail = where.substring(
    indexOfClientEmail + clientEmailKey.length + 1,
    nextParam
  )

  const encodedEmail = encodeURIComponent(clientEmail)

  const adjustedWhere = where.replace(clientEmail, encodedEmail)

  const response = await returnAppClient.getOrders(ctx, adjustedWhere)

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
