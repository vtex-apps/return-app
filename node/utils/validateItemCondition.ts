import type { ReturnRequestItemInput } from '../../typings/ReturnRequest'
import { UserInputError } from '@vtex/api'

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
