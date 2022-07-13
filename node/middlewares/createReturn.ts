import { json } from 'co-body'
import type { ReturnRequestInput } from 'vtex.return-app'
import { UserInputError } from '@vtex/api'

import { createReturnRequestService } from '../services/createReturnRequestService'

const shallowBodyValidation = (
  body: Partial<ReturnRequestInput>
): ReturnRequestInput => {
  const { locale, orderId } = body

  if (!orderId) {
    throw new UserInputError('Missing orderId')
  }

  const { name, email, phoneNumber } = body.customerProfileData ?? {}

  if (!name || !email || !phoneNumber) {
    throw new UserInputError('Missing customerProfileData information')
  }

  const { addressId, address, city, state, country, zipCode, addressType } =
    body.pickupReturnData ?? {}

  if (
    !addressId ||
    !address ||
    !city ||
    !state ||
    !country ||
    !zipCode ||
    !addressType
  ) {
    throw new UserInputError('Missing pickupReturnData information')
  }

  const { refundPaymentMethod } = body.refundPaymentData ?? {}

  if (!refundPaymentMethod) {
    throw new UserInputError('Missing refundPaymentMethod information')
  }

  if (!locale) {
    throw new UserInputError('Missing locale information')
  }

  return {
    ...body,
    orderId,
    items: body.items ?? [],
    customerProfileData: {
      ...body.customerProfileData,
      name,
      email,
      phoneNumber,
    },
    pickupReturnData: {
      ...body.pickupReturnData,
      addressId,
      address,
      city,
      state,
      country,
      zipCode,
      addressType,
    },
    refundPaymentData: {
      ...body.refundPaymentData,
      refundPaymentMethod,
    },
    locale,
  }
}

export async function createReturn(ctx: Context) {
  const { req } = ctx

  const body = await json(req)

  ctx.body = await createReturnRequestService(ctx, shallowBodyValidation(body))
  ctx.status = 204
}
