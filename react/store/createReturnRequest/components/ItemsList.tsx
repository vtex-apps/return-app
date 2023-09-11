import React from 'react'
import type { IntlFormatters } from 'react-intl'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'

import { useReturnRequest } from '../../hooks/useReturnRequest'
import { useStoreSettings } from '../../hooks/useStoreSettings'
import { ItemsDetails } from './ItemsDetails'
import { CustomMessage } from './layout/CustomMessage'

interface Props {
  items: ItemToReturn[]
  creationDate?: string
}

const CSS_HANDLES = ['itemsListContainer', 'itemsListTheadWrapper'] as const

const desktopOrder = [
  'product',
  'quantity',
  'available-to-return',
  'quantity-to-return',
  'reason',
  'condition',
]

const mobileOrder = [
  'product',
  'quantity-to-return',
  'reason',
  'condition',
  'quantity',
  'available-to-return',
]

export const messages = defineMessages({
  product: {
    id: 'return-app.return-order-details.table-header.product',
  },
  quantity: {
    id: 'return-app.return-order-details.table-header.quantity',
  },
  'available-to-return': {
    id: 'return-app.return-order-details.table-header.available-to-return',
  },
  'quantity-to-return': {
    id: 'return-app.return-order-details.table-header.quantity-to-return',
  },
  reason: {
    id: 'return-app.return-order-details.table-header.reason',
  },
  condition: {
    id: 'return-app.return-order-details.table-header.condition',
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
        {formatMessage(messages[value])}
      </th>
    )
  }
}

export const ItemsList = (props: Props) => {
  const { items, creationDate } = props

  const { data: storeSettings } = useStoreSettings()
  const { options } = storeSettings ?? {}
  const { enableSelectItemCondition } = options ?? {}

  const {
    hints: { phone },
  } = useRuntime()

  const { formatMessage } = useIntl()

  const handles = useCssHandles(CSS_HANDLES)
  const { inputErrors } = useReturnRequest()

  const noItemSelected = inputErrors.some(
    (error) => error === 'no-item-selected'
  )

  const TableHeader = TableHeaderRenderer(
    formatMessage,
    Boolean(enableSelectItemCondition)
  )

  return (
    <table
      className={`${handles.itemsListContainer} w-100`}
      style={{ borderCollapse: 'collapse' }}
    >
      <thead
        className={`${handles.itemsListContainer} w-100 ph4 truncate overflow-x-hidden c-muted-2 f6`}
      >
        <tr className="w-100 truncate overflow-x-hidden">
          {phone
            ? mobileOrder.map((header) => TableHeader(header))
            : desktopOrder.map((header) => TableHeader(header))}
        </tr>
      </thead>
      <tbody className="v-mid return-itemsList-body">
        {items.map((item) => (
          <ItemsDetails
            key={item.id}
            itemToReturn={item}
            creationDate={creationDate}
          />
        ))}
      </tbody>
      {noItemSelected ? (
        <CustomMessage
          status="error"
          message={
            <FormattedMessage id="return-app.return-items-list.no-items-selected.error" />
          }
        />
      ) : null}
    </table>
  )
}
