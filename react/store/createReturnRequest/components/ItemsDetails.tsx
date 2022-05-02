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
          otherReason,
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

  return (
    <tr>
      <td>Item</td>
      <td>
        <p>{quantity}</p>
      </td>
      <td>
        <p>{quantityAvailable}</p>
        {isExcluded ? (
          <p>Store does not allow this product to be returned</p>
        ) : null}
      </td>
      <td>
        <NumericStepper
          size="smaill"
          maxValue={isExcluded ? 0 : quantityAvailable}
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
      </td>
      <td>
        <RenderConditionDropdown
          isExcluded={isExcluded}
          condition={currentItem?.condition ?? ''}
          onConditionChange={handleConditionChange}
        />
      </td>
    </tr>
  )
}
