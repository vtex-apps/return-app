import { UserInputError } from '@vtex/api'

import type { ReturnRequestItemInput } from '../../typings/ReturnRequest'

export const validateItemCondition = (
  itemsToReturn: ReturnRequestItemInput[],
  considerCondition?: boolean | null
) => {
  considerCondition &&
    itemsToReturn.forEach(({ condition }, orderItemIndex) => {
      if (!condition || condition === 'unspecified') {
        throw new UserInputError(
          `Item index ${orderItemIndex} has no Item condition. Account settings state that Item condition cannot be unspecified.`
        )
      }
    })
}
