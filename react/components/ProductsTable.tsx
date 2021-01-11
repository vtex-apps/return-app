import React, { Component } from "react";
import styles from "../styles.css";
import { FormattedMessage } from "react-intl";
import { FormattedCurrency } from "vtex.format-currency";
import { requestsStatuses } from "../common/utils";
import {
  IconClock,
  IconFailure,
  IconSuccess,
  IconVisibilityOn,
  IconWarning
} from "vtex.styleguide";

interface Props {
  product: any;
  totalRefundAmount: any;
  intlZone: string;
}

function FormattedMessageFixed(props) {
  return <FormattedMessage {...props} />;
}

class ProductsTable extends Component<Props> {
  constructor(props, context) {
    super(props);
  }

  renderIcon = (product: any) => {
    if (product.status === requestsStatuses.approved) {
      return (
        <div>
          <span className={styles.statusApproved}>
            <IconSuccess size={14} /> {product.status}
          </span>
        </div>
      );
    }

    if (product.status === requestsStatuses.denied) {
      return (
        <div>
          <span className={styles.statusDenied}>
            <IconFailure size={14} /> {product.status}
          </span>
        </div>
      );
    }

    if (product.status === requestsStatuses.partiallyApproved) {
      return (
        <div>
          <span className={styles.statusPartiallyApproved}>
            <IconWarning size={14} /> {product.status}
          </span>
        </div>
      );
    }

    if (product.status === requestsStatuses.pendingVerification) {
      return (
        <div>
          <span className={styles.statusPendingVerification}>
            <IconClock size={14} /> {product.status}
          </span>
        </div>
      );
    }

    return (
      <div>
        <span className={styles.statusNew}>
          <IconVisibilityOn size={14} /> {product.status}
        </span>
      </div>
    );
  };

  render() {
    const { product, totalRefundAmount, intlZone } = this.props;
    const messages = {
      product: `${intlZone}.product`,
      quantity: `${intlZone}.quantity`,
      unitPrice: `${intlZone}.unitPrice`,
      subtotalRefund: `${intlZone}.subtotalRefund`,
      productVerificationStatus: `${intlZone}.productVerificationStatus`,
      noProducts: `${intlZone}.noProducts`,
      totalRefundAmount: `${intlZone}.totalRefundAmount`
    };
    return (
      <table
        className={
          styles.table + " " + styles.tableSm + " " + styles.tableProducts
        }
      >
        <thead>
          <tr>
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
                  {currentProduct.skuName}
                </td>
                <td className={styles.textCenter}>{currentProduct.quantity}</td>
                <td className={styles.textCenter}>
                  <FormattedCurrency value={currentProduct.unitPrice / 100} />
                </td>
                <td>
                  <FormattedCurrency
                    value={
                      (currentProduct.unitPrice * currentProduct.quantity) / 100
                    }
                  />
                </td>
                <td>{this.renderIcon(currentProduct)}</td>
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
