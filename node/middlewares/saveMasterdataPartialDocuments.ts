import { json } from 'co-body'

export async function saveMasterdataPartialDocuments(
  ctx: Context,
  next: () => Promise<any>
) {
  const body = await json(ctx.req)
  const {
    clients: { masterData: masterDataClient },
    vtex: { logger },
  } = ctx

  const { schemaName } = ctx.vtex.route.params

  const response = await masterDataClient.savePartial(ctx, schemaName, body)

  if (!response) {
    throw new Error('Error saving MasterData partial documents')
  }

  logger.info({
    message: `Save partial documents on ${schemaName} successfully`,
    data: response,
  })

  ctx.status = 200
  ctx.set('Cache-Control', 'no-cache')
  ctx.body = response

  await next()
}
