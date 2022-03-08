export async function receiveDocuments(ctx: Context) {
  const {
    clients: { masterData: masterDataClient },
    vtex: { logger },
  } = ctx

  const { schemaName, whereClause, type } = ctx.vtex.route.params

  const response = await masterDataClient.getDocuments(
    ctx,
    schemaName,
    type,
    whereClause
  )

  if (!response) {
    throw new Error(
      `Error receiving documents on type: ${type} on schema: ${schemaName} where: ${whereClause}`
    )
  }

  logger.info({
    message: 'Received documents successfully',
    data: response,
  })

  ctx.status = 200
  ctx.set('Cache-Control', 'no-cache')
  ctx.body = response
}
