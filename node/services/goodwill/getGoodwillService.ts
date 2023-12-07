import { UserInputError } from '@vtex/api'

import { calculateAvailableAmountsService } from '../calculateAvailableAmountsService'

const getGoodwillsService = async (ctx: Context, id?: string) => {
  const {
    clients: { goodwill },
  } = ctx

  const fields = [
    'id',
    'creditnoteID',
    'orderId',
    'creditAmount',
    'status',
    'createdIn',
  ]

  if (!id) {
    const pagination = {
      page: 1,
      pageSize: 100,
    }

    const sort = 'createdIn DESC'

    return goodwill.searchRaw(pagination, fields, sort)
  }

  const response = await goodwill.get(id, fields)

  if (!response) {
    throw new UserInputError("Goodwill doesn't exist")
  }

  const availableAmount = await calculateAvailableAmountsService(
    ctx,
    {
      order: { orderId: id },
    },
    'GET'
  )

  return {
    ...response,
    availableAmount,
  }
}

export default getGoodwillsService
