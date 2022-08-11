import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { useReturnRequest } from '../../hooks/useReturnRequest'
import { useStoreSettings } from '../../hooks/useStoreSettings'
import { ItemsDetails } from './ItemsDetails'
import { CustomMessage } from './layout/CustomMessage'

interface Props {
  items: ItemToReturn[]
  creationDate?: string
}

const CSS_HANDLES = ['itemsListContainer', 'itemsListTheadWrapper'] as const

export const ItemsList = (props: Props) => {
  const { items, creationDate } = props

  const { data: storeSettings } = useStoreSettings()
  const { options } = storeSettings ?? {}
  const { enableSelectItemCondition } = options ?? {}

  const handles = useCssHandles(CSS_HANDLES)
  const { inputErrors } = useReturnRequest()

  const noItemSelected = inputErrors.some(
    (error) => error === 'no-item-selected'
  )

  return (
    <table className={`${handles.itemsListContainer} w-100`}>
      <thead
        className={`${handles.itemsListContainer} w-100 ph4 truncate overflow-x-hidden c-muted-2 f6`}
      >
        <tr className="w-100 truncate overflow-x-hidden">
          <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s">
            <FormattedMessage id="store/return-app.return-order-details.table-header.product" />
          </th>
          <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s tc">
            <FormattedMessage id="store/return-app.return-order-details.table-header.quantity" />
          </th>
          <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s tc">
            <FormattedMessage id="store/return-app.return-order-details.table-header.available-to-return" />
          </th>
          <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s tc">
            <FormattedMessage id="store/return-app.return-order-details.table-header.quantity-to-return" />
          </th>
          <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s tc">
            <FormattedMessage id="store/return-app.return-order-details.table-header.reason" />
          </th>
          {!enableSelectItemCondition ? null : (
            <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s tc">
              <FormattedMessage id="store/return-app.return-order-details.table-header.condition" />
            </th>
          )}
        </tr>
      </thead>
      <tbody className="v-mid">
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
