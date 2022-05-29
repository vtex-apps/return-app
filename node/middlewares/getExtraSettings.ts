/* Used to fetch settings apart from the masterdata settings document */
export async function getExtraSettings(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { apps },
  } = ctx

  const appId = process.env.VTEX_APP_ID as string
  const settings = (await apps.getAppSettings(appId)) as Settings

  console.log(appId)
  console.log(settings)

  ctx.status = 200
  ctx.body = settings

  await next()
}
