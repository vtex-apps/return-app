export async function returnAppGetSchemas(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { returnApp: returnAppClient }
  } = ctx;

  const { schema } = ctx.vtex.route.params;

  const response = await returnAppClient.getSchema(ctx, schema.toString());

  ctx.status = 200;
  ctx.body = response;

  await next();
}
