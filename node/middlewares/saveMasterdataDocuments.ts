import { json } from 'co-body'
export async function saveMasterdataDocuments(ctx: Context, next: () => Promise<any>) {

    const body = await json(ctx.req)
    const {
        clients: {returnApp: returnAppClient}
    } = ctx
    const { schemaName } = ctx.vtex.route.params
    const response = await returnAppClient.saveDocuments(schemaName, body)

    ctx.status = 200
    ctx.body = response

    await next()
}
