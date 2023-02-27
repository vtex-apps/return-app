import React from 'react'
import type { ItemCondition } from 'vtex.return-app'
import { NumericStepper, Box } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'

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

  const {
    hints: { phone },
  } = useRuntime()

  const CSS_HANDLES_PHONE = [
    'cardWrapper',
    'productImageWrapper',
    'productImage',
    'productDetailsWrapper',
    'productText',
    'quantityWrapper',
    'quantityKey',
    'quantityValue',
    'availableToReturnWrapper',
    'availableToReturnKey',
    'availableToReturnValue',
    'quantitySelectorWrapper',
    'reasonWrapper',
    'conditionWrapper',
  ] as const

  const handles = useCssHandles(CSS_HANDLES)
  const handlesPhone = useCssHandles(CSS_HANDLES_PHONE)

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

  const ItemQuantityDataCell = (
    <>
      <td className={`${handles.detailsTdWrapper} pa4`}>
        <p className={`${handles.itemsDetailText} tc`}>{quantity}</p>
      </td>
      <td className={`${handles.detailsTdWrapper} pa4`}>
        <p className={`${handles.itemsDetailText} tc`}>{availableToReturn}</p>
      </td>
    </>
  )

  if (phone) {
    return (
      <div className={`${handlesPhone.cardWrapper} mb4`}>
        <Box>
          <div className={`${handlesPhone.productImageWrapper} flex`}>
            <img
              className={`${handlesPhone.productImage}`}
              src={imageUrl}
              alt="Product"
            />
          </div>
          <div
            className={`${handlesPhone.productDetailsWrapper} flex flex-column`}
          >
            <p className={`${handlesPhone.productText}`}>
              {localizedName ?? name}
            </p>
            <div
              className={`${handlesPhone.quantityWrapper} flex flex-row mb4`}
            >
              <span className={`${handlesPhone.quantityKey} mr2`}>
                <FormattedMessage id="store/return-app.return-order-details.table-header.quantity" />
                :
              </span>
              <span className={`${handlesPhone.quantityValue}`}>
                {quantity}
              </span>
            </div>
            <div
              className={`${handlesPhone.availableToReturnWrapper} flex flex-row mb4`}
            >
              <span className={`${handlesPhone.availableToReturnKey} mr2`}>
                <FormattedMessage id="store/return-app.return-order-details.table-header.available-to-return" />
                :
              </span>
              <span className={`${handlesPhone.availableToReturnValue}`}>
                {availableToReturn}
              </span>
            </div>
            {isExcluded ? (
              <CustomMessage
                status="warning"
                message={
                  <FormattedMessage id="store/return-app.return-item-details.excluded-items.warning" />
                }
              />
            ) : null}
            <div className={`${handlesPhone.quantitySelectorWrapper} mb4`}>
              <NumericStepper
                size="small"
                maxValue={availableToReturn}
                value={currentItem?.quantity ?? 0}
                onChange={(e: { value: number }) =>
                  handleQuantityChange(e.value)
                }
              />
            </div>
            <div className={`${handlesPhone.reasonWrapper} mb4`}>
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
            </div>
            {!enableSelectItemCondition ? null : (
              <div className={`${handlesPhone.conditionWrapper}`}>
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
              </div>
            )}
          </div>
        </Box>
      </div>
    )
  }

  return (
    <tr className={`${handles.detailsRowContainer}`}>
      <td className={`${handles.detailsTdWrapper} pa4`}>
        <section
          className={`${handles.productSectionWrapper} flex ${
            phone ? 'w5' : ''
          }`}
        >
          <div
            className={`${handles.productImageWrapper} flex`}
            style={{ flexBasis: '50%' }}
          >
            <img
              className={`${handles.productImage}`}
              src={imageUrl}
              alt="Product"
            />
          </div>
          <p
            className={`${handles.productText} t-body fw5 ml3`}
            style={{ flexBasis: '100%' }}
          >
            {localizedName ?? name}
          </p>
          {isExcluded ? (
            <CustomMessage
              status="warning"
              message={
                <FormattedMessage id="store/return-app.return-item-details.excluded-items.warning" />
              }
            />
          ) : null}
        </section>
      </td>
      {phone ? null : ItemQuantityDataCell}
      <td className={`${handles.detailsTdWrapper} pa4`}>
        <NumericStepper
          size="small"
          maxValue={availableToReturn}
          value={currentItem?.quantity ?? 0}
          onChange={(e: { value: number }) => handleQuantityChange(e.value)}
        />
      </td>
      <td className={`${handles.detailsTdWrapper} pa4`}>
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
        <td className={`${handles.detailsTdWrapper} pa4`}>
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
      {!phone ? null : ItemQuantityDataCell}
    </tr>
  )
}
