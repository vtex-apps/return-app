import { json } from 'co-body'

export async function sendMail(ctx: Context, next: () => Promise<any>) {
  const body = await json(ctx.req)
  const {
    clients: { returnApp: returnAppClient },
    vtex: { logger },
  } = ctx

  try {
    const response = await returnAppClient.sendMail(ctx, body)

    logger.info({
      message: `Send email successfully`,
      data: response,
    })

    throw new Error('error sending email')

    ctx.status = 200
    ctx.body = response
  } catch (e) {
    logger.error({
      message: `Error sending email`,
      error: e,
      data: {
        ctx,
        body,
      },
    })
  }

  await next()
}
