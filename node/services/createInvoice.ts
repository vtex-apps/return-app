import { UserInputError, ResolverError } from '@vtex/api'

import {
  SETTINGS_PATH
} from '../utils/constants'
import { isUserAllowed } from '../utils/isUserAllowed'
import { InvoiceRequest } from '../typings/InvoiceRequest'
import { calculateAvailableAmountsService } from './calculateAvailableAmountsService'

export const createInvoice = async (
  ctx: Context,
  id: string | string[] ,
  args: InvoiceRequest
) => {
  const {
    clients: {
      oms,
      appSettings,
    },
    state: { userProfile, appkey },
  } = ctx
  const orderId = String(id)
  const {
    type,
    issuanceDate,
    invoiceNumber,
    invoiceValue,
    dispatchDate,
    items,
  } = args

  if (!appkey && !userProfile) {
    throw new ResolverError('Missing appkey or userProfile')
  }

  const { firstName, lastName, email } = userProfile ?? {}

  const submittedByNameOrEmail =
    firstName || lastName ? `${firstName} ${lastName}` : email

  // If request was validated using appkey and apptoken, we assign the appkey as a sender
  // Otherwise, we try to use requester name. Email is the last resort.
  const submittedBy = appkey ?? submittedByNameOrEmail

  if (!submittedBy) {
    throw new ResolverError(
      'Unable to get submittedBy from context. The request is missing the userProfile info or the appkey'
    )
  }

  // Check items since a request via endpoint might not have it.
  // Graphql validation doesn't prevent user to send empty items
  if (!items || items.length === 0) {
    throw new UserInputError('There are no items in the request')
  }

  // For requests where orderId is an empty string
  if (!orderId) {
    throw new UserInputError('Order ID is missing')
  }

    // For requests where type is not correct
    if (type !== 'Input' && type !== 'Output'  ) {
      throw new UserInputError('Required type Input or Output')
    }

  const orderPromise = oms.order(orderId, 'AUTH_TOKEN')


  const settingsPromise = appSettings.get(SETTINGS_PATH, true)

  // If order doesn't exist, it throws an error and stop the process.
  // If there is no request created for that order, request searchRMA will be an empty array.
  const [order, settings] = await Promise.all([
    orderPromise,
    settingsPromise,
  ])

  if (!settings) {
    throw new ResolverError('Return App settings is not configured', 500)
  }

  const {
    clientProfileData,
    // @ts-expect-error itemMetadata is not typed in the OMS client project
    itemMetadata,
  } = order

  isUserAllowed({
    requesterUser: userProfile,
    clientProfile: clientProfileData,
    appkey,
  })
  //Validate type
  //GET availableAmount
  let availableAmount = await calculateAvailableAmountsService(
    ctx,
    {
      order: { orderId: id },
    },
    'GET'
  )

  if(type === 'Input'){
    //If is INPUT validate valueAvailabeToReturn
    let available = availableAmount.remainingRefundableAmount - availableAmount.amountToBeRefundedInProcess
    if(invoiceValue > available){
      throw new ResolverError('Return App already have a amountToBeRefundedInProcess that is greater than the invoiceValue', 500)
    }

  }
  try {
    const response = await oms.createInvoice(orderId, {
      type,
      issuanceDate,
      invoiceNumber,
      invoiceValue,
      dispatchDate,
      items,
    })
    if(type === 'Input'){
      if(availableAmount.initialInvoicedAmount){
        calculateAvailableAmountsService(
          ctx,
          {
            order: { orderId: orderId},
            amountRefunded: invoiceValue,
          },
          'UPDATE'
        )
      }else{
        calculateAvailableAmountsService(
          ctx,
          {
            order,
            amountRefunded: invoiceValue,
          },
          'CREATE'
        )
      }
    }
    availableAmount = await calculateAvailableAmountsService(
      ctx,
      {
        order: { orderId: id },
      },
      'GET'
    )
    return { response , availableAmount}

  } catch (error) {
    throw new ResolverError(`Return App invoice error ${error.message}`, 500 )

  }

}
