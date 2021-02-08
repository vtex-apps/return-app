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
      productsValue: `${intl}.totalProductsValue`,
      productVerificationStatus: `${intl}.productVerificationStatus`,
      noProducts: `${intl}.noProducts`,
      totalRefundAmount: `${intl}.totalRefundAmount`
    };
    return (
      <table
        className={
          styles.table + " " + styles.tableSm + " " + styles.tableProducts
        }
      >
        <thead>
          <tr>
            <th />
            <th>
              <FormattedMessageFixed id={messages.product} />
            </th>
            <th>
              <FormattedMessageFixed id={messages.quantity} />
            </th>
            <th>
              <FormattedMessageFixed id={messages.unitPrice} />
            </th>
            <th>
              <FormattedMessageFixed id={messages.subtotalRefund} />
            </th>
            <th>
              <FormattedMessageFixed id={messages.productVerificationStatus} />
            </th>
          </tr>
        </thead>
        <tbody>
          {product.length ? (
            product.map(currentProduct => (
              <tr key={currentProduct.skuId}>
                <td className={styles.tableProductColumn}>
                  <img
                    src={currentProduct.imageUrl}
                    alt={currentProduct.skuName}
                  />
                </td>
                <td className={`${styles.tableProductColumn}`}>
                  {currentProduct.skuName}
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
                <td>{currentProduct.quantity}</td>
                <td>
                  <FormattedCurrency value={currentProduct.unitPrice / 100} />
                </td>
                <td>
                  <FormattedCurrency
                    value={
                      (currentProduct.unitPrice * currentProduct.quantity) / 100
                    }
                  />
                </td>
                <td>{renderIcon(currentProduct, intl)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className={styles.textCenter}>
                <FormattedMessageFixed id={messages.noProducts} />
              </td>
            </tr>
          )}
          <tr className={styles.tableProductsRow}>
            <td />
            <td colSpan={3}>
              <strong>
                <FormattedMessageFixed id={messages.productsValue} />
              </strong>
            </td>
            <td colSpan={2}>
              <strong>
                <FormattedCurrency value={productsValue / 100} />
              </strong>
            </td>
          </tr>
          <tr className={styles.tableProductsRow}>
            <td />
            <td colSpan={3}>
              <strong>
                <FormattedMessageFixed id={messages.totalRefundAmount} />
              </strong>
            </td>
            <td colSpan={2}>
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
