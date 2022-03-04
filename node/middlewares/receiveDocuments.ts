/* eslint import/no-nodejs-modules: ["error", {"allow": ["url"]}] */
import { URLSearchParams } from 'url' /** @ref https://nodejs.org/api/url.html#new-urlsearchparams */

import type { RETURNS_SCHEMA, PRODUCTS_SCHEMA } from '../../common/constants'
import { statusToError } from '../utils/statusToError'

type ReturnKeys = keyof typeof RETURNS_SCHEMA.properties
type ProductKeys = keyof typeof PRODUCTS_SCHEMA.properties

type ReturnRequests = {
  [Key in ReturnKeys]: string
}

type ProductRequests = {
  [Key in ProductKeys]: string
}

export async function receiveDocuments(ctx: Context) {
  const {
    clients: { masterData: masterDataClient },
    vtex: { logger },
    state,
  } = ctx

  const { schemaName, whereClause, type } = ctx.vtex.route.params

  const { userId } = state
  const whereClauseQueries = new URLSearchParams(whereClause as string)

  const userIdFromURL = whereClauseQueries.get('userId')

  if (userIdFromURL && userIdFromURL !== userId) {
    /**
     * if userId is not the same as the one in the URL, we throw an unauthorized error.
     */
    throw statusToError({
      status: 401,
      message: 'unauthorized',
    })
  }

  const response = await masterDataClient.getDocuments(
    ctx,
    schemaName,
    type,
    whereClause
  )

  if (!response) {
    throw new Error(
      `Error receiving documents on type: ${type} on schema: ${schemaName} where: ${whereClause}`
    )
  }

  logger.info({
    message: 'Received documents successfully',
    data: response,
  })

  if (schemaName === 'returnRequests' || schemaName === 'returnProducts') {
    const productMatchedUserId = response.filter(
      (product: ReturnRequests | ProductRequests) => {
        /**
         * return only the products that match the userId
         */
        return product.userId && product.userId === userId
      }
    )
    if (!productMatchedUserId.length) {
      throw new Error(
        `Error receiving documents on type: ${type} on schema: ${schemaName} where: ${whereClause}`
      )
    }

    ctx.status = 200
    ctx.set('Cache-Control', 'no-cache')
    ctx.body = productMatchedUserId

    return
  }
  ctx.status = 200
  ctx.set('Cache-Control', 'no-cache')
  ctx.body = response
}
