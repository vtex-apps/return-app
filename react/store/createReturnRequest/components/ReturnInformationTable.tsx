import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import type { ReturnRequestItemInput } from 'vtex.return-app'

// import { defaultReturnReasonsMessages } from '../../utils/defaultReturnReasonsMessages'
import { defaultReturnConditionsMessages } from '../../utils/defaultReturnConditionsMessages'

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
                          {formatMessage(
                            defaultReturnConditionsMessages[condition]
                          )}
                        </p>
                      </div>
                      <div className="flex">
                        <p className="f6 mv0 mr3 gray b">
                          {' '}
                          <FormattedMessage id="store/return-app.return-information-table.table-row.p-reason" />{' '}
                        </p>
                        <p className="f6 mv0 gray ">
                          {reason}{' '}
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
