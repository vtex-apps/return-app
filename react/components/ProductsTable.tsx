import React, { Component } from "react";
import styles from "../styles.css";
import { FormattedCurrency } from "vtex.format-currency";
import { FormattedMessageFixed, renderIcon } from "../common/utils";

interface Props {
  product: any;
  totalRefundAmount: any;
  productsValue: any;
  intl: string;
}

class ProductsTable extends Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const { product, totalRefundAmount, productsValue, intl } = this.props;
    const messages = {
      product: `${intl}.product`,
      quantity: `${intl}.quantity`,
      unitPrice: `${intl}.unitPrice`,
      subtotalRefund: `${intl}.subtotalRefund`,
      reason: `${intl}.thReason`,
      refId: `${intl}.thRefId`,
      productsValue: `${intl}.totalProductsValue`,
      productVerificationStatus: `${intl}.productVerificationStatus`,
      noProducts: `${intl}.noProducts`,
      totalRefundAmount: `${intl}.totalRefundAmount`
    };
    return (
      <table
        className={`${styles.table} ${styles.tableSm} ${styles.tableProducts}`}
      >
        <thead className={`${styles.tableThead}`}>
          <tr className={`${styles.tableTr}`}>
            <th className={`${styles.tableTh}`} />
            <th className={`${styles.tableTh}`}>
              <FormattedMessageFixed id={messages.product} />
            </th>
            <th className={`${styles.tableTh}`}>
              <FormattedMessageFixed id={messages.quantity} />
            </th>
            <th className={`${styles.tableTh}`}>
              <FormattedMessageFixed id={messages.unitPrice} />
            </th>
            <th className={`${styles.tableTh}`}>
              <FormattedMessageFixed id={messages.subtotalRefund} />
            </th>
            <th className={`${styles.tableTh}`}>
              <FormattedMessageFixed id={messages.productVerificationStatus} />
            </th>
          </tr>
        </thead>
        <tbody className={`${styles.tableTbody}`}>
          {product.length ? (
            product.map(currentProduct => (
              <tr key={currentProduct.skuId} className={`${styles.tableTr}`}>
                <td
                  className={`${styles.tableTd} ${styles.tableProductColumn}`}
                >
                  <img
                    src={currentProduct.imageUrl}
                    alt={currentProduct.skuName}
                  />
                </td>
                <td
                  className={`${styles.tableTd} ${styles.tableProductColumn}`}
                >
                  {currentProduct.skuName}

                  <div className={`${styles.reasonStyle} ${styles.mt10}`}>
                    <span className={styles.strongText}>
                      <FormattedMessageFixed id={messages.refId} />
                      {": "}
                    </span>
                    {currentProduct.skuId}
                  </div>

                  <div className={`${styles.reasonStyle} ${styles.mt10}`}>
                    <span className={styles.strongText}>
                      <FormattedMessageFixed id={messages.reason} />
                      {": "}
                    </span>
                    <FormattedMessageFixed
                      id={`${intl}.${currentProduct.reasonCode}`}
                    />{" "}
                    {currentProduct.reasonCode === "reasonOther"
                      ? "( " + currentProduct.reason + " )"
                      : null}
                  </div>
                </td>
                <td className={`${styles.tableTd}`}>
                  {currentProduct.quantity}
                </td>
                <td className={`${styles.tableTd}`}>
                  <FormattedCurrency value={currentProduct.unitPrice / 100} />
                </td>
                <td className={`${styles.tableTd}`}>
                  <FormattedCurrency
                    value={
                      (currentProduct.unitPrice * currentProduct.quantity) / 100
                    }
                  />
                </td>
                <td className={`${styles.tableTd}`}>
                  {renderIcon(currentProduct, intl)}
                </td>
              </tr>
            ))
          ) : (
            <tr className={`${styles.tableTr} ${styles.tableTrNoProducts}`}>
              <td colSpan={5} className={styles.textCenter}>
                <FormattedMessageFixed id={messages.noProducts} />
              </td>
            </tr>
          )}
          <tr className={`${styles.tableTr} ${styles.tableProductsRow}`}>
            <td className={`${styles.tableTd}`} />
            <td className={`${styles.tableTd}`} colSpan={3}>
              <strong>
                <FormattedMessageFixed id={messages.productsValue} />
              </strong>
            </td>
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
                <FormattedMessageFixed id={messages.totalRefundAmount} />
              </strong>
            </td>
            <td className={`${styles.tableTd}`} colSpan={2}>
              <strong>
                <FormattedCurrency value={totalRefundAmount / 100} />
              </strong>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default ProductsTable;
