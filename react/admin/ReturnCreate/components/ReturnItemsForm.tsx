import React, { useMemo } from 'react'
import type { IntlFormatters } from 'react-intl'
import { defineMessages, useIntl } from 'react-intl'
import { useQuery } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'
import type { ReturnAppSettings } from 'vtex.return-app'
import { Button, Dropdown, NumericStepper, Textarea } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import { getReasonOptions } from '../../../common/constants/returnsRequest'
import GET_APP_SETTINGS from '../../settings/graphql/getAppSettings.gql'
import { defaultReturnReasonsMessages } from '../../../store/utils/defaultReturnReasonsMessages'
import { generateCustomReasonOptions } from '../../../store/utils/generateCustomReasonOptions'
import type { Order } from '../types/Order'
import type { ReturnItem, ReturnReason } from '../types/ReturnRequestForm'

interface ReturnItemsFormProps {
  items: ReturnItem[]
  onChange: (items: ReturnItem[]) => void
  order: Order | null
}

const ITEM_CONDITIONS = [
  { value: 'unspecified', label: 'Unspecified' },
  { value: 'newWithBox', label: 'New with box' },
  { value: 'newWithoutBox', label: 'New without box' },
  { value: 'usedWithBox', label: 'Used with box' },
  { value: 'usedWithoutBox', label: 'Used without box' },
]

const ADMIN_DEFAULT_RETURN_REASONS = [
  { value: 'defective', label: 'Defective' },
  { value: 'wrongItem', label: 'Wrong item' },
  { value: 'sizeIssue', label: 'Size issue' },
  { value: 'other', label: 'Other' },
]

const CSS_HANDLES = [
  'itemsListContainer',
  'itemsListTheadWrapper',
  'cardItemsWrapper',
  'detailsRowContainer',
  'detailsTdWrapper',
  'productSectionWrapper',
  'productText',
  'productImageWrapper',
  'productImage',
  'itemsDetailText',
  'cardWrapper',
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

const desktopOrder = [
  'product',
  'quantity',
  'available-to-return',
  'quantity-to-return',
  'reason',
  'condition',
]

export const messages = defineMessages({
  product: {
    id: 'admin/return-app.return-order-details.table-header.product',
  },
  quantity: {
    id: 'admin/return-app.return-order-details.table-header.quantity',
  },
  'available-to-return': {
    id: 'admin/return-app.return-order-details.table-header.available-to-return',
  },
  'quantity-to-return': {
    id: 'admin/return-app.return-order-details.table-header.quantity-to-return',
  },
  reason: {
    id: 'admin/return-app.return-order-details.table-header.reason',
  },
  condition: {
    id: 'admin/return-app.return-order-details.table-header.condition',
  },
})

const TableHeaderRenderer = (
  formatMessage: IntlFormatters['formatMessage'],
  addCondition: boolean
) => {
  return function Header(value: string) {
    if (!addCondition && value === 'condition') {
      return
    }

    return (
      <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s">
        {formatMessage(messages[value as keyof typeof messages])}
      </th>
    )
  }
}

function buildReturnReasonOptions(
  settings: ReturnAppSettings | undefined,
  formatMessage: IntlFormatters['formatMessage'],
  locale: string,
  creationDate?: string
) {
  const customReturnReasons = settings?.customReturnReasons

  if (customReturnReasons?.length) {
    const options = generateCustomReasonOptions(
      customReturnReasons,
      locale,
      creationDate
    )

    if (settings?.options?.enableOtherOptionSelection) {
      options.push({
        value: 'other',
        label: formatMessage(defaultReturnReasonsMessages.reasonOtherReason),
      })
    }

    return options
  }

  const defaultOptions = getReasonOptions(formatMessage)

  return defaultOptions.length > 0
    ? defaultOptions
    : ADMIN_DEFAULT_RETURN_REASONS
}

export const ReturnItemsForm: React.FC<ReturnItemsFormProps> = ({
  items,
  onChange,
  order,
}) => {
  const enableSelectItemCondition = false
  const { formatMessage } = useIntl()
  const handles = useCssHandles(CSS_HANDLES)
  const {
    culture: { locale: runtimeLocale },
  } = useRuntime()

  const { data: settingsData } = useQuery<{
    returnAppSettings: ReturnAppSettings
  }>(GET_APP_SETTINGS)

  const locale =
    order?.clientPreferencesData?.locale ?? runtimeLocale ?? 'en-US'

  const reasonOptions = useMemo(
    () =>
      buildReturnReasonOptions(
        settingsData?.returnAppSettings,
        formatMessage,
        locale,
        order?.creationDate
      ),
    [
      settingsData?.returnAppSettings,
      formatMessage,
      locale,
      order?.creationDate,
    ]
  )

  const defaultReturnReason = reasonOptions[0]?.value ?? 'other'

  const TableHeader = TableHeaderRenderer(
    formatMessage,
    Boolean(enableSelectItemCondition)
  )

  const handleItemChange = (
    index: number,
    field: keyof ReturnItem,
    value: any
  ) => {
    const newItems = [...items]

    newItems[index] = { ...newItems[index], [field]: value }
    onChange(newItems)
  }

  const handleReturnReasonChange = (index: number, reason: string) => {
    const returnReason: ReturnReason = {
      reason,
      ...(reason === 'other' || reason === 'otherReason'
        ? { otherReason: items[index].returnReason?.otherReason ?? '' }
        : {}),
    }

    handleItemChange(index, 'returnReason', returnReason)
  }

  const handleOtherReasonChange = (index: number, otherReason: string) => {
    handleItemChange(index, 'returnReason', {
      ...items[index].returnReason,
      reason: items[index].returnReason?.reason ?? 'other',
      otherReason,
    })
  }

  const SelectAllItems = () => {
    const updatedItems = items.map((item, index) => ({
      ...item,
      quantity: order?.items[index].quantity || 0,
      returnReason: { reason: defaultReturnReason },
    }))

    onChange(updatedItems)
  }

  return (
    <div className="mb5">
      <table
        className={`${handles.itemsListContainer} w-100`}
        style={{ borderCollapse: 'collapse' }}
      >
        <thead
          className={`${handles.itemsListContainer} w-100 ph4 truncate overflow-x-hidden c-muted-2 f6`}
        >
          <tr className="w-100 truncate overflow-x-hidden">
            {desktopOrder.map((header) => TableHeader(header))}
          </tr>
        </thead>
        <tbody className="v-mid return-itemsList-body">
          {order &&
            items.map((item, index) => (
              <tr key={index} className={`${handles.detailsRowContainer}`}>
                <td className={`${handles.detailsTdWrapper} pa4`}>
                  <section className={`${handles.productSectionWrapper} flex`}>
                    <div
                      className={`${handles.productImageWrapper} flex`}
                      style={{ flexBasis: '50%' }}
                    >
                      <img
                        className={`${handles.productImage}`}
                        src={order.items[index].imageUrl}
                        alt="Product"
                      />
                    </div>
                    <p
                      className={`${handles.productText} t-body fw5 ml3`}
                      style={{ flexBasis: '100%' }}
                    >
                      {`SKU:${order.items[index].id} - ${order.items[index].name}`}
                    </p>
                  </section>
                </td>
                <td className={`${handles.detailsTdWrapper} pa4`}>
                  <p className={`${handles.itemsDetailText} tc`}>
                    {order.items[index].quantity}
                  </p>
                </td>
                <td className={`${handles.detailsTdWrapper} pa4`}>
                  <p className={`${handles.itemsDetailText} tc`}>
                    {order.items[index].quantity}
                  </p>
                </td>
                <td className={`${handles.detailsTdWrapper} pa4`}>
                  <NumericStepper
                    size="small"
                    maxValue={order.items[index].quantity}
                    value={item.quantity ?? 0}
                    onChange={(e: { value: number }) =>
                      handleItemChange(index, 'quantity', e.value)
                    }
                  />
                </td>
                <td className={`${handles.detailsTdWrapper} pa4`}>
                  <div className={`${handles.reasonWrapper}`}>
                    <Dropdown
                      placeholder="Return Reason"
                      options={reasonOptions}
                      value={item.returnReason?.reason}
                      onChange={(_, value) =>
                        handleReturnReasonChange(index, value)
                      }
                    />
                    {item.returnReason?.reason === 'other' ||
                    item.returnReason?.reason === 'otherReason' ? (
                      <div className="mt3">
                        <Textarea
                          resize="none"
                          value={item.returnReason?.otherReason ?? ''}
                          onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>
                          ) => handleOtherReasonChange(index, e.target.value)}
                        />
                      </div>
                    ) : null}
                  </div>
                </td>
                {!enableSelectItemCondition ? null : (
                  <td className={`${handles.detailsTdWrapper} pa4`}>
                    <Dropdown
                      label="Condition"
                      options={ITEM_CONDITIONS}
                      value={item.condition}
                      onChange={(_, value) =>
                        handleItemChange(index, 'condition', value)
                      }
                    />
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
      <div className="mt6 ml4 flex justify-end">
        <Button onClick={() => order && SelectAllItems()}>
          Select All Items
        </Button>
      </div>
    </div>
  )
}
