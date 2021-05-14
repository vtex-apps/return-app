export async function getOrders(ctx: Context, next: () => Promise<any>) {

    const {
        clients: {returnApp: returnAppClient}
    } = ctx
    const { where } = ctx.vtex.route.params
    const response = await returnAppClient.getOrders(ctx, where)

    ctx.status = 200
    ctx.body = response

    await next()
}
