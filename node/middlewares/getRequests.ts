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

  try {
    const response = await masterDataClient.getDocumentsWithPagination(
      ctx,
      options
    )

    logger.info({
      message: 'Get requests with pagination successfully',
      data: response,
    })

    ctx.status = 200
    ctx.set('Cache-Control', 'no-cache')
    ctx.body = response
  } catch (e) {
    logger.error({
      message: `Error getting requests with pagination`,
      error: e,
      data: {
        ctx,
        options,
      },
    })
  }

  await next()
}
