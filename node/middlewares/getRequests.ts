export async function getRequests(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { masterData: masterDataClient },
    vtex: { logger },
  } = ctx

  const { schemaName, whereClause, page, pageSize, sortBy, sortOrder } =
    ctx.vtex.route.params

  const options = {
    schema: schemaName,
    where: whereClause,
    sortBy,
    sortOrder,
    page,
    pageSize,
  }

  const response = await masterDataClient.getDocumentsWithPagination(
    ctx,
    options
  )

  if (!response) {
    throw new Error(`Error getting requests`)
  }

  logger.info({
    message: 'Get requests with pagination successfully',
    data: response,
  })

  ctx.status = 200
  ctx.set('Cache-Control', 'no-cache')
  ctx.body = response

  await next()
}
