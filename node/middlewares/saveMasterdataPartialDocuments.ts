import { json } from 'co-body'

export async function saveMasterdataPartialDocuments(
  ctx: Context,
  next: () => Promise<any>
) {
  const body = await json(ctx.req)
  const {
    clients: { masterData: masterDataClient },
  } = ctx

  const { schemaName } = ctx.vtex.route.params
  const response = await masterDataClient.savePartial(ctx, schemaName, body)

  ctx.status = 200
  ctx.set('Cache-Control', 'no-cache')
  ctx.body = response

  await next()
}
