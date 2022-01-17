import { getSettings, validateSettings } from "../utils/settings"


function isServiceContext(
  ctx: Context<any> 
): ctx is Context<any> {
  return (ctx as Context<any>).status !== undefined
}

export default async function validateSettingsMiddleware(
  ctx: Context<any>,
  next: () => Promise<any>
) {
  const {
    vtex: { logger },
  } = ctx

  const settings = await getSettings(ctx)

  const validationResponse = validateSettings(settings)

  if (validationResponse.hasError) {
    logger.error(validationResponse.message)

    if (isServiceContext(ctx)) {
      ctx.status = 500
    }

    ctx.body = 'Internal error. Invalid settings!'

    return
  }

  await next()
  return settings
}
