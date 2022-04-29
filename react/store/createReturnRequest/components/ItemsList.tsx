import React from 'react'
import { FormattedMessage } from 'react-intl'

import { useReturnRequest } from '../../hooks/useReturnRequest'
import { ItemsDetails } from './ItemsDetails'

interface Props {
  items: ItemToReturn[]
}

export const ItemsList = ({ items }: Props) => {
  const { inputErrors } = useReturnRequest()

  const noItemSelected = inputErrors.some(
    (error) => error === 'no-item-selected'
  )

  return (
    <table className="w-100">
      <thead className="w-100 ph4 truncate overflow-x-hidden c-muted-2 f6">
        <tr className="w-100 truncate overflow-x-hidden">
          <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s">
            <FormattedMessage id="store/return-app.return-order-details.table-header.product" />
          </th>
          <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s">
            <FormattedMessage id="store/return-app.return-order-details.table-header.quantity" />
          </th>
          <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s">
            <FormattedMessage id="store/return-app.return-order-details.table-header.available-to-return" />
          </th>
          <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s">
            <FormattedMessage id="store/return-app.return-order-details.table-header.quantity-to-return" />
          </th>
          <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s">
            <FormattedMessage id="store/return-app.return-order-details.table-header.reason" />
          </th>
          <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s">
            <FormattedMessage id="store/return-app.return-order-details.table-header.condition" />
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <ItemsDetails key={item.id} {...item} />
        ))}
      </tbody>
      {/* TODO Intl */}
      {noItemSelected ? <div>No item selected</div> : null}
    </table>
  )
}
