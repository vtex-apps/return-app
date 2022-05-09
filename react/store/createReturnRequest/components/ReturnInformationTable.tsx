import React from 'react'
import { FormattedMessage } from 'react-intl'

// interface ItemInformationDetails {
//   name: string
//   imageUrl: string
//   quantity: number
//   orderItemIndex: number
//   condition: string
//   returnReason: {
//     reason: string
//     otherReason: string
//   }
// }

// interface Props {
//   items: ItemInformationDetails[]
// }

export const ReturnInformationTable = () => {
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
        {/* {items.map(({ name, quantity, imageUrl }) => {
          return quantity ? (
            <tr className="ph5">
              <td className="w-50 pv5">
                <div className="flex ml2">
                  <img src={imageUrl} alt="Product" />
                  <p>{name}</p>
                </div>
              </td>
              <td className="w-50 tc pv5">
                <p>{quantity}</p>
              </td>
            </tr>
          ) : null
        })} */}
      </tbody>
    </table>
  )
}
