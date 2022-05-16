import React from 'react'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import type { ReturnRequestItemInput } from 'vtex.return-app'

const messages = defineMessages({
  reasonAccidentalOrder: {
    id: 'store/return-app.return-order-details.dropdown-reasons.accidental-order',
  },
  reasonBetterPrice: {
    id: 'store/return-app.return-order-details.dropdown-reasons.better-price',
  },
  reasonPerformance: {
    id: 'store/return-app.return-order-details.dropdown-reasons.performance',
  },
  reasonIncompatible: {
    id: 'store/return-app.return-order-details.dropdown-reasons.incompatible',
  },
  reasonItemDamaged: {
    id: 'store/return-app.return-order-details.dropdown-reasons.item-damaged',
  },
  reasonMissedDelivery: {
    id: 'store/return-app.return-order-details.dropdown-reasons.missed-delivery',
  },
  reasonMissingParts: {
    id: 'store/return-app.return-order-details.dropdown-reasons.missing-parts',
  },
  reasonBoxDamaged: {
    id: 'store/return-app.return-order-details.dropdown-reasons.box-damaged',
  },
  reasonDifferentProduct: {
    id: 'store/return-app.return-order-details.dropdown-reasons.different-product',
  },
  reasonDefective: {
    id: 'store/return-app.return-order-details.dropdown-reasons.defective',
  },
  reasonArrivedInAddition: {
    id: 'store/return-app.return-order-details.dropdown-reasons.arrived-in-addition',
  },
  reasonNoLongerNeeded: {
    id: 'store/return-app.return-order-details.dropdown-reasons.no-longer-needed',
  },
  reasonUnauthorizedPurchase: {
    id: 'store/return-app.return-order-details.dropdown-reasons.unauthorized-purchase',
  },
  reasonDifferentFromWebsite: {
    id: 'store/return-app.return-order-details.dropdown-reasons.different-from-website',
  },
  reasonOtherReason: {
    id: 'store/return-app.return-order-details.dropdown-reasons.other-reason',
  },
  reasonSelectReason: {
    id: 'store/return-app.return-order-details.dropdown-reasons.placeholder.select-reason',
  },
  newWithBox: {
    id: 'store/return-app.return-order-details.dropdown-conditions.new-with-box',
  },
  newWithoutBox: {
    id: 'store/return-app.return-order-details.dropdown-conditions.new-without-box',
  },
  usedWithBox: {
    id: 'store/return-app.return-order-details.dropdown-conditions.used-with-box',
  },
  usedWithoutBox: {
    id: 'store/return-app.return-order-details.dropdown-conditions.used-without-box',
  },
})

interface Props {
  items: ItemToReturn[]
  selectedItems: ReturnRequestItemInput[]
}

export const ReturnInformationTable = ({ items, selectedItems }: Props) => {
  const { formatMessage } = useIntl()

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
        {selectedItems.map(
          ({ quantity, orderItemIndex, condition, returnReason }) => {
            const { reason } = returnReason

            return quantity ? (
              <tr className="ph5">
                <td className="w-50 pv5">
                  <div className="flex items-center ml2">
                    <div className="mr3">
                      <img src={items[orderItemIndex].imageUrl} alt="Product" />
                    </div>
                    <div>
                      <p className="b">{items[orderItemIndex].name}</p>
                      <div className="flex">
                        <p className="f6 mt0 mr3 gray b">
                          <FormattedMessage id="store/return-app.return-information-table.table-row.p-condition" />
                        </p>
                        <p className="f6 mt0 gray ">
                          {formatMessage(messages[condition])}
                        </p>
                      </div>
                      <div className="flex">
                        <p className="f6 mv0 mr3 gray b">
                          {' '}
                          <FormattedMessage id="store/return-app.return-information-table.table-row.p-reason" />{' '}
                        </p>
                        <p className="f6 mv0 gray ">
                          {formatMessage(messages[reason])}{' '}
                          {returnReason?.otherReason
                            ? returnReason?.otherReason
                            : null}
                        </p>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="w-50 tc pv5">
                  <p>{quantity}</p>
                </td>
              </tr>
            ) : null
          }
        )}
      </tbody>
    </table>
  )
}
