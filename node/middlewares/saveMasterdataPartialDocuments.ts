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

  try {
    const response = await masterDataClient.savePartial(ctx, schemaName, body)

    logger.info({
      message: `Save partial documents on ${schemaName} successfully`,
      data: response,
    })

    ctx.status = 200
    ctx.set('Cache-Control', 'no-cache')
    ctx.body = response
  } catch (e) {
    logger.error({
      message: `Error saving partial documents on schema: ${schemaName}`,
      error: e,
      data: {
        ctx,
        body,
      },
    })
  }

  await next()
}
