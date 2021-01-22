export async function generateReturnsSchema(ctx: Context, next: () => Promise<any>) {

    const {
        clients: {returnApp: returnAppClient}
    } = ctx
    const response = await returnAppClient.generateSchema(ctx)

    ctx.status = 200
    ctx.body = response

    await next()
}
