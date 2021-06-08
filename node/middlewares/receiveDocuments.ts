export async function receiveDocuments(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { masterData: masterDataClient }
  } = ctx;
  const { schemaName, whereClause, type } = ctx.vtex.route.params;
  const response = await masterDataClient.getDocuments(
    ctx,
    schemaName,
    type,
    whereClause
  );

  ctx.status = 200;
  ctx.body = response;

  await next();
}
