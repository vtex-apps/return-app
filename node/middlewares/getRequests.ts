export async function getRequests(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { masterData: masterDataClient },
  } = ctx

  const { schemaName, whereClause, page, pageSize, sortBy, sortOrder } = ctx.vtex.route.params

  const options = {
    schema: schemaName,
    where: whereClause,
    sortBy,
    sortOrder,
    page,
    pageSize
  }
  const response = await masterDataClient.getDocumentsWithPagination(
    ctx,
    options
  )

  ctx.status = 200
  ctx.set('Cache-Control', 'no-cache')
  ctx.body = response

  await next()
}
