import React from 'react'
import { FormattedMessage } from 'react-intl'
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

const TableHeader = (addCondition: boolean) => {
  return function Header(value: string) {
    if (!addCondition && value === 'condition') {
      return
    }

    return (
      <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s">
        <FormattedMessage
          id={`store/return-app.return-order-details.table-header.${value}`}
        />
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

  const handles = useCssHandles(CSS_HANDLES)
  const { inputErrors } = useReturnRequest()

  const noItemSelected = inputErrors.some(
    (error) => error === 'no-item-selected'
  )

  const RenderHeader = TableHeader(enableSelectItemCondition)

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
            ? mobileOrder.map(RenderHeader)
            : desktopOrder.map(RenderHeader)}
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
            <FormattedMessage id="store/return-app.return-items-list.no-items-selected.error" />
          }
        />
      ) : null}
    </table>
  )
}
