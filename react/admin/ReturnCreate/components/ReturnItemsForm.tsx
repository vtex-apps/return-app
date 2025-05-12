import React from 'react'
import type { IntlFormatters } from 'react-intl'
import { defineMessages, useIntl } from 'react-intl'
import { Button, Dropdown, NumericStepper } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import type { Order } from '../types/Order'
import type { ReturnItem } from '../types/ReturnRequestForm'

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

const RETURN_REASONS = [
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

export const ReturnItemsForm: React.FC<ReturnItemsFormProps> = ({
  items,
  onChange,
  order,
}) => {
  const enableSelectItemCondition = false
  const { formatMessage } = useIntl()
  const handles = useCssHandles(CSS_HANDLES)

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

  const SelectAllItems = () => {
    const updatedItems = items.map((item, index) => ({
      ...item,
      quantity: order?.items[index].quantity || 0,
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
                      {order.items[index].name}
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
                  <Dropdown
                    placeholder="Return Reason"
                    options={RETURN_REASONS}
                    value={item.returnReason?.reason}
                    onChange={(_, value) =>
                      handleItemChange(index, 'returnReason', {
                        ...item.returnReason,
                        reason: value,
                      })
                    }
                  />
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
