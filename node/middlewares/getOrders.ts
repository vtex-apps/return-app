/* eslint import/no-nodejs-modules: ["error", {"allow": ["url"]}] */
import { URLSearchParams } from 'url'
/** @ref https://nodejs.org/api/url.html#new-urlsearchparams */
export async function getOrders(ctx: Context) {
  const {
    clients: { returnApp: returnAppClient },
    state,
    vtex: { logger },
  } = ctx

  const { userEmail } = state

  const { where } = ctx.vtex.route.params


  const response = await returnAppClient.getOrders(ctx, where)

  if (!response) {
    throw new Error(`Error getting orders`)
  }

  logger.info({
    message: 'Get orders successfully',
    data: response,
  })

  ctx.status = 200
  ctx.set('Cache-Control', 'no-cache')
  ctx.status = 200

  const hasUserEmail = userEmail && userEmail.length > 0 // just double check if the state has the userEmail.

  if (!where && hasUserEmail) {
    const response = await returnAppClient.getOrders(
      ctx,
      `clientEmail=${userEmail}`
    )

    ctx.body = response

    return
  } // gaurd against empty params

  if (typeof where === 'string' && hasUserEmail) {
    const queries = new URLSearchParams(where)

    /**
     * Always we set the clientEmail with the userEmail in the URL params just in case if someone passes in the url with different email or null or empty string.
     * also it will cover the case when pass only all with page and page_number as well or any other queries, so it reduce the code and make it easier to maintain.
     */
    queries.set('clientEmail', userEmail as string)

    const response = await returnAppClient.getOrders(ctx, queries.toString())

    ctx.body = response
  }
}
