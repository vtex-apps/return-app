import { v4 as uuidv4 } from 'uuid'

import { SETTINGS_PATH } from '../../utils/constants'
import { calculateAvailableAmountsService } from '../calculateAvailableAmountsService'

const createGoodwillService = async (ctx: Context, goodwill: Goodwill) => {
  const {
    clients: { oms, appSettings, goodwill: goodwillClient },
  } = ctx

  const settings = await appSettings.get(SETTINGS_PATH, true)

  if (!settings?.options?.enableGoodwill) {
    throw new Error('Goodwill is not enabled.')
  }

  const { orderId } = goodwill
  const order = await oms.order(orderId)

  if (order.status !== 'invoiced') {
    throw new Error('Order is not invoiced.')
  }

  await calculateAvailableAmountsService(
    ctx,
    {
      order,
      amountRefunded: goodwill.creditAmount,
    },
    'CREATE'
  )

  goodwill.status = 'amountRefunded'
  goodwill.creditnoteID = uuidv4()

  await goodwillClient.save({
    ...goodwill,
    id: goodwill.orderId,
  })

  const goodwillData = await goodwillClient.get(goodwill.orderId, ['createdIn'])

  await oms.createInvoice(goodwill.orderId, {
    type: 'Input',
    issuanceDate: goodwillData.createdIn,
    invoiceNumber: JSON.stringify({
      type: 'Goodwill',
      creditnoteID: goodwill.creditnoteID,
      createdBy: 'CusCare',
      reason: goodwill.reason,
    }),
    invoiceValue: goodwill.creditAmount as number,
    items: [],
  })

  return {
    message: `Goodwill created successfully for orderId: ${orderId}`,
    goodwill,
  }
}

export default createGoodwillService
