import { json } from 'co-body'
export async function updateMasterdataDocuments(ctx: Context, next: () => Promise<any>) {

    const body = await json(ctx.req)
    const {
        clients: {returnApp: returnAppClient}
    } = ctx
    const { documentId } = ctx.vtex.route.params
    const response = await returnAppClient.updateDocuments(documentId, body)

    ctx.status = 200
    ctx.body = response

    await next()
}
