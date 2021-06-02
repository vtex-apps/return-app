import React, { Component } from "react";
import styles from "../styles.css";
import { beautifyDate } from "../common/utils";
import { injectIntl, defineMessages } from "react-intl";
import { Button } from "vtex.styleguide";

interface Props {
  eligibleOrders: any;
  selectOrder: any;
  intl: any;
}

const messages = defineMessages({
  thOrderId: { id: "returns.thOrderId" },
  thCreationDate: { id: "returns.thCreationDate" },
  thSelectOrder: { id: "returns.thSelectOrder" },
  noOrders: { id: "returns.no_eligible_orders" }
});

class EligibleOrdersTable extends Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      eligibleOrders,
      selectOrder,
      intl: { formatMessage }
    } = this.props;

    return (
      <div>
        {eligibleOrders.length ? (
          <div>
            <table className={styles.table + " " + styles.tableEligibleOrders}>
              <thead>
                <tr>
                  <th className={styles.tableTh}>
                    {formatMessage({ id: messages.thOrderId.id })}
                  </th>
                  <th className={styles.tableTh}>
                    {formatMessage({ id: messages.thCreationDate.id })}
                  </th>
                  <th className={styles.tableTh}>
                    {formatMessage({ id: messages.thSelectOrder.id })}
                  </th>
                </tr>
              </thead>
              <tbody>
                {eligibleOrders
                  .sort((a, b) => (a.creationDate < b.creationDate ? 1 : -1))
                  .map(order => {
                    return (
                      <tr key={order.orderId}>
                        <td>{order.orderId}</td>
                        <td>{beautifyDate(order.creationDate)}</td>
                        <td className={styles.tableColButton}>
                          <Button
                            size={`small`}
                            onClick={() => selectOrder(order)}
                          >
                            {formatMessage({ id: messages.thSelectOrder.id })}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ) : (
          <div>{formatMessage({ id: messages.noOrders.id })}</div>
        )}
      </div>
    );
  }
}

export default injectIntl(EligibleOrdersTable);
