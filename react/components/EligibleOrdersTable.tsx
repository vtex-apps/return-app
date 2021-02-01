import React, { Component } from "react";
import styles from "../styles.css";
import { beautifyDate } from "../common/utils";
import { FormattedMessage } from "react-intl";
import { Button } from "vtex.styleguide";

interface Props {
  eligibleOrders: any;
  selectOrder: any;
}

class EligibleOrdersTable extends Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const { eligibleOrders, selectOrder } = this.props;

    return (
      <div>
        {eligibleOrders.length ? (
          <div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>
                    <FormattedMessage id={"store/my-returns.thOrderId"} />
                  </th>
                  <th>
                    <FormattedMessage id={"store/my-returns.thCreationDate"} />
                  </th>
                  <th>
                    <FormattedMessage id={"store/my-returns.thSelectOrder"} />
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
                        <td>
                          <Button
                            size={`small`}
                            onClick={() => selectOrder(order)}
                          >
                            <FormattedMessage
                              id={"store/my-returns.thSelectOrder"}
                            />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <FormattedMessage id={"store/my-returns.no_eligible_orders"} />
          </div>
        )}
      </div>
    );
  }
}

export default EligibleOrdersTable;
