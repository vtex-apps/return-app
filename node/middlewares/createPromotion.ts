import { json } from 'co-body'
export async function createPromotion(ctx: Context, next: () => Promise<any>) {

    const body = await json(ctx.req)
    const {
        clients: {returnApp: returnAppClient}
    } = ctx
    const response = await returnAppClient.createPromotion(ctx, body)

    ctx.status = 200
    ctx.body = response

    await next()
}
