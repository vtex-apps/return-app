export async function receiveDocuments(ctx: Context, next: () => Promise<any>) {

    const {
        clients: {returnApp: returnAppClient}
    } = ctx
    const { schemaName } = ctx.vtex.route.params
    const response = await returnAppClient.getDocuments(schemaName)

    ctx.status = 200
    ctx.body = response

    await next()
}
