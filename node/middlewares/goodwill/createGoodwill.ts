import createGoodwillService from '../../services/goodwill/createGoodwillService'

export async function createGoodwill(
  ctx: Context,
  next: () => Promise<any>
): Promise<any> {
  const { body } = ctx

  try {
    ctx.body = await createGoodwillService(ctx, body as Goodwill)
  } catch (error) {
    ctx.status = error.response?.status || 500
    ctx.body = {
      message:
        error.response?.data?.Message ||
        error.response?.data?.error ||
        error.message,
    }
  }

  ctx.set('Cache-Control', 'no-cache')
  await next()
}
