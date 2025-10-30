import { UserInputError } from '@vtex/api'
import { json } from 'co-body'
import { CommonLogger } from '../utils/commonLogger'
import { createReturnRequestService } from '../services/createReturnRequestService'

export async function createReturn(ctx: Context) {
  const { req } = ctx
  const body = await json(req)
  const { locale, orderId } = body

  // Log return request creation start
  CommonLogger.logBusinessOperation(ctx, 'createReturnRequest', {
    orderId,
    locale,
    hasItems: !!body.items,
    itemCount: body.items?.length
  }, { 
    file: 'middlewares/createReturn.ts', 
    function: 'createReturn' 
  })

  if (!locale) {
    throw new UserInputError('Locale is required.')
  }

  ctx.vtex.locale = locale
  const result = await createReturnRequestService(ctx, body)
  
  // Log successful creation
  CommonLogger.logBusinessOperation(ctx, 'returnRequestCreated', {
    requestId: result.returnRequestId,
    orderId,
    locale
  }, { 
    file: 'middlewares/createReturn.ts', 
    function: 'createReturn' 
  })

  ctx.body = result
  ctx.status = 201
}
