import getGoodwillsService from '../../services/goodwill/getGoodwillService'

export async function getGoodwills(
  ctx: Context,
  next: () => Promise<any>
): Promise<any> {
  const {
    vtex: {
      route: {
        params: { id },
      },
    },
  } = ctx

  try {
    ctx.body = await getGoodwillsService(ctx, id as string)
  } catch (error) {
    ctx.status = error.response?.status || error.status || 500
    ctx.body = {
      message: error.response?.data?.Message || error.message || error,
    }
  }

  ctx.set('Cache-Control', 'no-cache')
  await next()
}
