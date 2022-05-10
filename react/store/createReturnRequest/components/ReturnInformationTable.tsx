import React from 'react'
import { FormattedMessage } from 'react-intl'
import type { ReturnRequestItemInput } from 'vtex.return-app'

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

interface Props {
  items: ItemToReturn[]
  selectedItems: Array<
    PartialBy<ReturnRequestItemInput, 'condition' | 'returnReason'>
  >
}

export const ReturnInformationTable = ({ items, selectedItems }: Props) => {
  return (
    <table className="w-100">
      <thead className="w-100 ph4 truncate overflow-x-hidden c-muted-2 f6">
        <tr className="w-100 truncate overflow-x-hidden">
          <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s tc">
            <FormattedMessage id="store/return-app.return-order-details.table-header.product" />
          </th>
          <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s tc">
            <FormattedMessage id="store/return-app.return-order-details.table-header.quantity-to-return" />
          </th>
        </tr>
      </thead>
      <tbody className="v-mid">
        {selectedItems.map(({ quantity, orderItemIndex }) => {
          return quantity ? (
            <tr className="ph5">
              <td className="w-50 pv5">
                <div className="flex ml2">
                  <img src={items[orderItemIndex].imageUrl} alt="Product" />
                  <p>{items[orderItemIndex].name}</p>
                </div>
              </td>
              <td className="w-50 tc pv5">
                <p>{quantity}</p>
              </td>
            </tr>
          ) : null
        })}
      </tbody>
    </table>
  )
}
