import type { FunctionComponent } from 'react'
import React from 'react'
import { FormattedCurrency } from 'vtex.format-currency'
import { injectIntl, defineMessages } from 'react-intl'

import styles from '../styles.css'
import { renderIcon } from '../common/utils'

interface Props {
  product: any
  totalRefundAmount: any
  productsValue: any
  intl: any
  totalShippingValue: any
  refundedShippingValue: any
}

const ProductsTable: FunctionComponent<Props> = (props) => {
  const {
    totalShippingValue,
    refundedShippingValue,
    product,
    totalRefundAmount,
    productsValue,
    intl: { formatMessage },
  } = props

  const messages = defineMessages({
    product: { id: `returns.product` },
    quantity: { id: `returns.quantity` },
    unitPrice: { id: `returns.unitPrice` },
    subtotalRefund: { id: `returns.subtotalRefund` },
    reason: { id: `returns.thReason` },
    refId: { id: `returns.thRefId` },
    productsValue: { id: `returns.totalProductsValue` },
    productVerificationStatus: {
      id: `returns.productVerificationStatus`,
    },
    noProducts: { id: `returns.noProducts` },
    totalRefundAmount: { id: `returns.totalRefundAmount` },
    productValueAvailableToBeRefunded: {
      id: `returns.productValueAvailableToBeRefunded`,
    },
    shippingValueAvailableToBeRefunded: {
      id: `returns.shippingValueAvailableToBeRefunded`,
    },
    shippingValueToBeRefunded: { id: `returns.shippingValueToBeRefunded` },
    restockFee: { id: `returns.restockFee` },
    tax: { id: `returns.tax` },
    condition: { id: `returns.condition.label` },
  })

  return (
    <table
      className={`${styles.table} ${styles.tableSm} ${styles.tableProducts}`}
    >
      <thead className={`${styles.tableThead}`}>
        <tr className={`${styles.tableTr}`}>
          <th className={`${styles.tableTh}`} />
          <th className={`${styles.tableTh}`}>
            {formatMessage({ id: messages.product.id })}
          </th>
          <th className={`${styles.tableTh}`}>
            {formatMessage({ id: messages.quantity.id })}
          </th>
          <th className={`${styles.tableTh}`}>
            {formatMessage({ id: messages.unitPrice.id })}
          </th>
          <th className={`${styles.tableTh}`}>
            {formatMessage({ id: messages.tax.id })}
          </th>
          <th className={`${styles.tableTh}`}>
            {formatMessage({ id: messages.subtotalRefund.id })}
          </th>
          <th className={`${styles.tableTh}`}>
            {formatMessage({ id: messages.restockFee.id })}
          </th>
          <th className={`${styles.tableTh}`}>
            {formatMessage({ id: messages.productVerificationStatus.id })}
          </th>
        </tr>
      </thead>
      <tbody className={`${styles.tableTbody}`}>
        {product.length ? (
          product.map((currentProduct) => (
            <tr key={currentProduct.skuId} className={`${styles.tableTr}`}>
              <td className={`${styles.tableTd} ${styles.tableProductColumn}`}>
                <img
                  className={`${styles.tableProductImage}`}
                  src={currentProduct.imageUrl}
                  alt={currentProduct.skuName}
                />
              </td>
              <td className={`${styles.tableTd} ${styles.tableProductColumn}`}>
                {currentProduct.skuName}

                <div className={`${styles.reasonStyle} ${styles.mt10}`}>
                  <span className={styles.strongText}>
                    {formatMessage({ id: messages.refId.id })}
                    {': '}
                  </span>
                  {currentProduct.skuId}
                </div>

                <div className={`${styles.reasonStyle} ${styles.mt10}`}>
                  <span className={styles.strongText}>
                    {formatMessage({ id: messages.reason.id })}
                    {': '}
                  </span>
                  {currentProduct.reasonCode?.substring(0, 6) === 'reason'
                    ? formatMessage({
                        id: `returns.${currentProduct.reasonCode}`,
                      })
                    : currentProduct.reasonCode}{' '}
                  {currentProduct.reasonCode === 'reasonOther'
                    ? `( ${currentProduct.reason} )`
                    : null}
                </div>

                <div className={`${styles.reasonStyle} ${styles.mt10}`}>
                  <span className={styles.strongText}>
                    {formatMessage({ id: messages.condition.id })}
                    {': '}
                  </span>
                  {currentProduct.condition}{' '}
                </div>
              </td>
              <td className={`${styles.tableTd} ${styles.tableReasonQty}`}>
                {currentProduct.quantity}
              </td>
              <td className={`${styles.tableTd}`}>
                <FormattedCurrency value={currentProduct.unitPrice / 100} />
              </td>
              <td className={`${styles.tableTd}`}>
                <FormattedCurrency value={currentProduct.tax || 0} />
              </td>
              <td className={`${styles.tableTd}`}>
                <FormattedCurrency
                  value={
                    (currentProduct.unitPrice / 100 +
                      (parseFloat(currentProduct.tax) || 0)) *
                    currentProduct.quantity
                  }
                />
              </td>
              <td className={`${styles.tableTd}`} style={{ color: 'red' }}>
                <FormattedCurrency
                  value={
                    (currentProduct.unitPrice / 100 +
                      (parseFloat(currentProduct.tax) || 0) *
                        currentProduct.quantity -
                      currentProduct.refundedValue || 0) * -1
                  }
                />
              </td>
              <td className={`${styles.tableTd}`}>
                {renderIcon(currentProduct)}
              </td>
            </tr>
          ))
        ) : (
          <tr className={`${styles.tableTr} ${styles.tableTrNoProducts}`}>
            <td colSpan={5} className={styles.textCenter}>
              {formatMessage({ id: messages.noProducts.id })}
            </td>
          </tr>
        )}
        <tr className={`${styles.tableTr} ${styles.tableProductsRow}`}>
          <td className={`${styles.tableTd}`} />
          <td className={`${styles.tableTd}`} colSpan={3}>
            <strong>{formatMessage({ id: messages.productsValue.id })}</strong>
          </td>
          <td className={`${styles.tableTd}`} />
          <td className={`${styles.tableTd}`} colSpan={2}>
            <strong>
              <FormattedCurrency value={productsValue / 100} />
            </strong>
          </td>
        </tr>
        <tr className={`${styles.tableTr} ${styles.tableProductsRow}`}>
          <td className={`${styles.tableTd}`} />
          <td className={`${styles.tableTd}`} colSpan={3}>
            <strong>
              {formatMessage({
                id: messages.productValueAvailableToBeRefunded.id,
              })}
            </strong>
          </td>
          <td className={`${styles.tableTd}`} />
          <td className={`${styles.tableTd}`} colSpan={2}>
            <strong>
              <FormattedCurrency
                value={product.reduce(
                  (acc, el) =>
                    acc +
                    (el.unitPrice / 100 + (el.tax ? el.tax : 0)) *
                      el.goodProducts,
                  0
                )}
              />
            </strong>
          </td>
        </tr>
        <tr className={`${styles.tableTr} ${styles.tableProductsRow}`}>
          <td className={`${styles.tableTd}`} />
          <td className={`${styles.tableTd}`} colSpan={3}>
            <strong>
              {formatMessage({
                id: messages.shippingValueAvailableToBeRefunded.id,
              })}
            </strong>
          </td>
          <td className={`${styles.tableTd}`} />
          <td className={`${styles.tableTd}`} colSpan={2}>
            <strong>
              <FormattedCurrency value={totalShippingValue} />
            </strong>
          </td>
        </tr>
        <tr className={`${styles.tableTr} ${styles.tableProductsRow}`}>
          <td className={`${styles.tableTd}`} />
          <td className={`${styles.tableTd}`} colSpan={3}>
            <strong>
              {formatMessage({ id: messages.shippingValueToBeRefunded.id })}
            </strong>
          </td>
          <td className={`${styles.tableTd}`} />
          <td className={`${styles.tableTd}`} colSpan={2}>
            <strong>
              <FormattedCurrency value={refundedShippingValue / 100 || 0} />
            </strong>
          </td>
        </tr>
        <tr className={`${styles.tableTr} ${styles.tableProductsRow}`}>
          <td className={`${styles.tableTd}`} />
          <td className={`${styles.tableTd}`} colSpan={3}>
            <strong>
              {formatMessage({ id: messages.totalRefundAmount.id })}
            </strong>
          </td>
          <td className={`${styles.tableTd}`} />
          <td className={`${styles.tableTd}`} colSpan={2}>
            <strong>
              <FormattedCurrency value={totalRefundAmount / 100} />
            </strong>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default injectIntl(ProductsTable)
