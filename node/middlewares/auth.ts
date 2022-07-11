export async function auth(ctx: Context, next: () => Promise<void>) {
  const {
    header,
    clients: { vtexId },
    state,
  } = ctx

  const appkey = header['x-vtex-api-appkey'] as string
  const apptoken = header['x-vtex-api-apptoken'] as string

  const { token } = await vtexId.login({ appkey, apptoken })

  state.token = token

  ctx.body = 'success'

  await next()
}
