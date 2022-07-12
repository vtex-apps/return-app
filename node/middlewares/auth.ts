export async function auth(ctx: Context, next: () => Promise<void>) {
  const {
    header,
    clients: { vtexId },
    state,
  } = ctx

  const appkey = header['x-vtex-api-appkey'] as string
  const apptoken = header['x-vtex-api-apptoken'] as string

  await vtexId.login({ appkey, apptoken })

  state.apptoken = apptoken

  ctx.body = 'success'

  await next()
}
