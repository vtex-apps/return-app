import type { FunctionComponent } from 'react'
import React from 'react'
import { injectIntl, defineMessages } from 'react-intl'
import { Button } from 'vtex.styleguide'

import styles from '../styles.css'
import { beautifyDate } from '../common/utils'

interface Props {
  eligibleOrders: any
  selectOrder: any
  intl: any
}

const messages = defineMessages({
  thOrderId: { id: 'returns.thOrderId' },
  thCreationDate: { id: 'returns.thCreationDate' },
  thSelectOrder: { id: 'returns.thSelectOrder' },
  noOrders: { id: 'returns.no_eligible_orders' },
})

const EligibleOrdersTable: FunctionComponent<Props> = (props) => {
  const {
    eligibleOrders,
    selectOrder,
    intl: { formatMessage },
  } = props

  return (
    <div>
      {eligibleOrders.length ? (
        <div>
          <table className={`${styles.table} ${styles.tableEligibleOrders}`}>
            <thead className={styles.tableThead}>
              <tr className={styles.tableTr}>
                <th className={`${styles.tableTh} ${styles.thEligibleOrderId}`}>
                  {formatMessage({ id: messages.thOrderId.id })}
                </th>
                <th
                  className={`${styles.tableTh} ${styles.thEligibleCreationDate}`}
                >
                  {formatMessage({ id: messages.thCreationDate.id })}
                </th>
                <th
                  className={`${styles.tableTh} ${styles.thEligibleSelectOrder}`}
                >
                  {formatMessage({ id: messages.thSelectOrder.id })}
                </th>
              </tr>
            </thead>
            <tbody className={styles.tableTbody}>
              {eligibleOrders
                .sort((a, b) => (a.creationDate < b.creationDate ? 1 : -1))
                .map((order) => {
                  return (
                    <tr key={order.orderId} className={styles.eligibleOrder}>
                      <td className={styles.tdEligibleOrderId}>
                        {order.orderId}
                      </td>
                      <td className={styles.tdEligibleCreationDate}>
                        {beautifyDate(order.creationDate)}
                      </td>
                      <td className={styles.tableColButton}>
                        <Button size="small" onClick={() => selectOrder(order)}>
                          {formatMessage({ id: messages.thSelectOrder.id })}
                        </Button>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.noEligibleOrders}>
          {formatMessage({ id: messages.noOrders.id })}
        </div>
      )}
    </div>
  )
}

export default injectIntl(EligibleOrdersTable)
