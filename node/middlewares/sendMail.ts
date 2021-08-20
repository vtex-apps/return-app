import { json } from 'co-body'

export async function sendMail(ctx: Context, next: () => Promise<any>) {
  const body = await json(ctx.req)
  const {
    clients: { returnApp: returnAppClient },
  } = ctx

  const response = await returnAppClient.sendMail(ctx, body)

  ctx.status = 200
  ctx.body = response

  await next()
}
