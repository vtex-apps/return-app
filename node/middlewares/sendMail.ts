import { json } from 'co-body'

export async function sendMail(ctx: Context, next: () => Promise<any>) {
  const body = await json(ctx.req)
  const {
    clients: { returnApp: returnAppClient },
    vtex: { logger },
  } = ctx

  const response = await returnAppClient.sendMail(ctx, body)

  if (!response) {
    throw new Error('Error sending email')
  }

  logger.info({
    message: `Send email successfully`,
    data: response,
  })

  ctx.status = 200
  ctx.body = response

  await next()
}
