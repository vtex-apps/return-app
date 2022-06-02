import React from 'react'
import type { ItemCondition } from 'vtex.return-app'
import { NumericStepper } from 'vtex.styleguide'

import { useReturnRequest } from '../../hooks/useReturnRequest'
import { CustomMessage } from './layout/CustomMessage'
import { RenderConditionDropdown } from './RenderConditionDropdown'
import { RenderReasonDropdown } from './RenderReasonDropdown'

interface Props {
  itemToReturn: ItemToReturn
  creationDate?: string
}

export const ItemsDetails = (props: Props) => {
  const {
    itemToReturn: {
      quantity,
      quantityAvailable,
      isExcluded,
      orderItemIndex,
      imageUrl,
      name,
    },
    creationDate,
  } = props

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
      <td>
        <section className="ml3">
          <p className="t-body fw5">{name}</p>
          <div className="flex">
            <img src={imageUrl} alt="Product" />
            {isExcluded ? (
              <CustomMessage
                status="warning"
                message="store/return-app.return-item-details.excluded-items.warning"
              />
            ) : null}
          </div>
        </section>
      </td>
      <td>
        <p className="tc">{quantity}</p>
      </td>
      <td>
        <p className="tc">{availableToReturn}</p>
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
          creationDate={creationDate}
        />
        {reasonError && reasonErrorEmptyValue ? (
          <CustomMessage
            status="error"
            message="store/return-app.return-item-details.dropdown-reason.error"
          />
        ) : null}
      </td>
      <td>
        <RenderConditionDropdown
          isExcluded={isExcluded}
          condition={currentItem?.condition ?? ''}
          onConditionChange={handleConditionChange}
        />
        {conditionError ? (
          <CustomMessage
            status="error"
            message="store/return-app.return-item-details.dropdown-condition.error"
          />
        ) : null}
      </td>
    </tr>
  )
}
