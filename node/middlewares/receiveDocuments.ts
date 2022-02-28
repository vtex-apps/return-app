export async function receiveDocuments(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { masterData: masterDataClient },
    vtex: { logger },
  } = ctx

  const { schemaName, whereClause, type } = ctx.vtex.route.params

  try {
    const response = await masterDataClient.getDocuments(
      ctx,
      schemaName,
      type,
      whereClause
    )

    logger.info({
      message: 'Received documents successfully',
      data: response,
    })

    ctx.status = 200
    ctx.set('Cache-Control', 'no-cache')
    ctx.body = response
    await next()
  } catch (e) {
    logger.error({
      message: 'error receiving docs',
      error: e,
      data: {
        ctx,
      },
    })

    throw e
  }
  // message: `Error receiving documents on type: ${type} on schema: ${schemaName} where: ${whereClause}`,
}
