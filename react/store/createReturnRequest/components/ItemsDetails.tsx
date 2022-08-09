import React from 'react'
import type { ItemCondition } from 'vtex.return-app'
import { NumericStepper } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedMessage } from 'react-intl'

import { useReturnRequest } from '../../hooks/useReturnRequest'
import { CustomMessage } from './layout/CustomMessage'
import { RenderConditionDropdown } from './RenderConditionDropdown'
import { RenderReasonDropdown } from './RenderReasonDropdown'
import { useStoreSettings } from '../../hooks/useStoreSettings'

interface Props {
  itemToReturn: ItemToReturn
  creationDate?: string
}

const CSS_HANDLES = [
  'detailsRowContainer',
  'detailsTdWrapper',
  'productSectionWrapper',
  'productText',
  'productImageWrapper',
  'productImage',
  'itemsDetailText',
] as const

export const ItemsDetails = (props: Props) => {
  const {
    itemToReturn: {
      quantity,
      quantityAvailable,
      isExcluded,
      orderItemIndex,
      imageUrl,
      name,
      localizedName,
    },
    creationDate,
  } = props

  const handles = useCssHandles(CSS_HANDLES)

  const { data: storeSettings } = useStoreSettings()
  const { options } = storeSettings ?? {}
  const { enableSelectItemCondition } = options ?? {}

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
    <tr className={`${handles.detailsRowContainer}`}>
      <td className={`${handles.detailsTdWrapper}`}>
        <section className={`${handles.productSectionWrapper} ml3`}>
          <p className={`${handles.productText} t-body fw5`}>
            {localizedName ?? name}
          </p>
          <div className={`${handles.productImageWrapper} flex`}>
            <img
              className={`${handles.productImage}`}
              src={imageUrl}
              alt="Product"
            />
            {isExcluded ? (
              <CustomMessage
                status="warning"
                message={
                  <FormattedMessage id="store/return-app.return-item-details.excluded-items.warning" />
                }
              />
            ) : null}
          </div>
        </section>
      </td>
      <td className={`${handles.detailsTdWrapper}`}>
        <p className={`${handles.itemsDetailText} tc`}>{quantity}</p>
      </td>
      <td className={`${handles.detailsTdWrapper}`}>
        <p className={`${handles.itemsDetailText} tc`}>{availableToReturn}</p>
      </td>
      <td className={`${handles.detailsTdWrapper}`}>
        <NumericStepper
          size="small"
          maxValue={availableToReturn}
          value={currentItem?.quantity ?? 0}
          onChange={(e: { value: number }) => handleQuantityChange(e.value)}
        />
      </td>
      <td className={`${handles.detailsTdWrapper}`}>
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
            message={
              <FormattedMessage id="store/return-app.return-item-details.dropdown-reason.error" />
            }
          />
        ) : null}
      </td>
      {!enableSelectItemCondition ? null : (
        <td className={`${handles.detailsTdWrapper}`}>
          <RenderConditionDropdown
            isExcluded={isExcluded}
            condition={currentItem?.condition ?? ''}
            onConditionChange={handleConditionChange}
          />
          {conditionError ? (
            <CustomMessage
              status="error"
              message={
                <FormattedMessage id="store/return-app.return-item-details.dropdown-condition.error" />
              }
            />
          ) : null}
        </td>
      )}
    </tr>
  )
}
