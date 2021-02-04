import { json } from 'co-body'
export async function saveMasterdataPartialDocuments(ctx: Context, next: () => Promise<any>) {

    const body = await json(ctx.req)
    const {
        clients: {returnApp: returnAppClient}
    } = ctx
    const { schemaName } = ctx.vtex.route.params
    const response = await returnAppClient.savePartial(ctx, schemaName, body)

    ctx.status = 200
    ctx.body = response

    await next()
}
