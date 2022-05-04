import React from 'react'
import type { ItemCondition } from 'vtex.return-app'
import { NumericStepper } from 'vtex.styleguide'

import { useReturnRequest } from '../../hooks/useReturnRequest'
import { RenderConditionDropdown } from './RenderConditionDropdown'
import { RenderReasonDropdown } from './RenderReasonDropdown'

export const ItemsDetails = (itemToReturn: ItemToReturn) => {
  const { quantity, quantityAvailable, isExcluded, orderItemIndex } =
    itemToReturn

  const {
    returnRequest,
    inputErrors,
    actions: { updateReturnRequest },
  } = useReturnRequest()

  const { items } = returnRequest

  const currentItem = items.find(
    ({ orderItemIndex: index }) => index === orderItemIndex
  )

  const handleQuantityChange = (value: number) => {
    if (!currentItem) return
    const updatedItems = items.map((item) => {
      if (item.orderItemIndex !== orderItemIndex) {
        return item
      }

      return {
        ...item,
        quantity: value,
      }
    })

    updateReturnRequest({
      type: 'updateItems',
      payload: updatedItems,
    })
  }

  const handleReasonChange = (reason: string, otherReason = '') => {
    if (!currentItem) return
    const updatedItems = items.map((item) => {
      if (item.orderItemIndex !== orderItemIndex) {
        return item
      }

      return {
        ...item,
        returnReason: {
          reason,
          ...(reason === 'otherReason' ? { otherReason } : null),
        },
      }
    })

    updateReturnRequest({
      type: 'updateItems',
      payload: updatedItems,
    })
  }

  const handleConditionChange = (condition: ItemCondition) => {
    if (!currentItem) return
    const updatedItems = items.map((item) => {
      if (item.orderItemIndex !== orderItemIndex) {
        return item
      }

      return {
        ...item,
        condition,
      }
    })

    updateReturnRequest({
      type: 'updateItems',
      payload: updatedItems,
    })
  }

  const noReasonOrCondition = inputErrors.some(
    (error) => error === 'reason-or-condition'
  )

  const selected = !isExcluded && currentItem?.quantity

  const reasonError = noReasonOrCondition && selected

  const emptyTextareaError =
    currentItem?.returnReason?.reason === 'otherReason' &&
    !currentItem?.returnReason?.otherReason

  const reasonErrorEmptyValue =
    !currentItem?.returnReason?.reason || emptyTextareaError

  const conditionError =
    noReasonOrCondition && selected && !currentItem?.condition

  const availableToReturn = isExcluded ? 0 : quantityAvailable

  return (
    <tr>
      <td>Item</td>
      <td>
        <p>{quantity}</p>
      </td>
      <td>
        <p>{availableToReturn}</p>
        {/* TODO Intl */}
        {isExcluded ? (
          <p>Store does not allow this product to be returned</p>
        ) : null}
      </td>
      <td>
        <NumericStepper
          size="smaill"
          maxValue={availableToReturn}
          value={currentItem?.quantity ?? 0}
          onChange={(e: { value: number }) => handleQuantityChange(e.value)}
        />
      </td>
      <td>
        <RenderReasonDropdown
          isExcluded={isExcluded}
          reason={currentItem?.returnReason?.reason ?? ''}
          otherReason={currentItem?.returnReason?.otherReason ?? ''}
          onReasonChange={handleReasonChange}
        />
        {/* TODO Intl */}
        {reasonError && reasonErrorEmptyValue ? 'Reason is required' : null}
        {/* TODO user input when other & error */}
      </td>
      <td>
        <RenderConditionDropdown
          isExcluded={isExcluded}
          condition={currentItem?.condition ?? ''}
          onConditionChange={handleConditionChange}
        />
        {/* TODO Intl */}
        {conditionError ? 'Condition is required' : null}
      </td>
    </tr>
  )
}
