export async function receiveDocuments(ctx: Context, next: () => Promise<any>) {

    const {
        clients: {returnApp: returnAppClient}
    } = ctx
    const { schemaName, whereClause, type } = ctx.vtex.route.params
    const response = await returnAppClient.getDocuments(ctx, schemaName, type, whereClause)

    ctx.status = 200
    ctx.body = response

    await next()
}
