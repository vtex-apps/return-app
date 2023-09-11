import { has, isEmpty } from 'ramda'
import { ResolverError } from '@vtex/api'

import { createGoodwillService } from '../services/createGoodwillServices'
import { returnRequestService } from '../services/returnRequestService'
import goodwilShema from '../utils/goodwillSchema'

export async function goodwill(ctx: Context, next: () => Promise<any>) {
  const {
    vtex: {
      route: { params },
    },
    body,
  } = ctx

  if (has('id', params) && !isEmpty(params.id)) {
    const { id } = params as { id: string }

    ctx.body = await returnRequestService(ctx, id, [
      'id',
      'orderId',
      'goodwillData',
      'reason',
      'sellerId',
      'refundPaymentData',
    ])
  } else {
    try {
      goodwilShema.validateAsync(body).catch((error: any) => {
        throw new ResolverError(error.message, 400)
      })

      const createdGoodwill = await createGoodwillService(ctx, body)

      ctx.body = createdGoodwill
    } catch (error) {
      if (error.response?.data?.error?.code === 'OMS007') {
        throw new ResolverError("Order doesn't exist", 404)
      } else if (error?.status === 400) {
        throw new ResolverError(error.message, error.status)
      }

      throw new ResolverError(error.message, 409)
    }
  }

  ctx.set('Cache-Control', 'no-cache')
  ctx.status = 200

  await next()
}
