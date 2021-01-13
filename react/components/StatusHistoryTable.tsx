import React, { Component } from "react";
import styles from "../styles.css";
import { returnFormDate, FormattedMessageFixed } from "../common/utils";

interface Props {
  statusHistory: any;
  intlZone: string;
}

class StatusHistoryTable extends Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const { statusHistory, intlZone } = this.props;
    const messages = {
      title: `${intlZone}.statusHistory`,
      date: `${intlZone}.date`,
      status: `${intlZone}.status`,
      submittedBy: `${intlZone}.submittedBy`
    };
    return (
      <div>
        <p className={"mt7"}>
          <strong>
            <FormattedMessageFixed id={messages.title} />
          </strong>
        </p>
        <div className={`flex flex-column items-stretch w-100`}>
          <div className={`flex flex-row items-stretch w-100`}>
            <div className={`flex w-33`}>
              <p className={styles.tableThParagraph}>
                <FormattedMessageFixed id={messages.date} />
              </p>
            </div>
            <div className={`flex w-33`}>
              <p className={styles.tableThParagraph}>
                <FormattedMessageFixed id={messages.status} />
              </p>
            </div>
            <div className={`flex w-33`}>
              <p className={styles.tableThParagraph}>
                <FormattedMessageFixed id={messages.submittedBy} />
              </p>
            </div>
          </div>
          {statusHistory.map((status, i) => (
            <div
              key={`statusHistoryTable_` + i}
              className={`flex flex-row items-stretch w-100`}
            >
              <div className={`flex w-33`}>
                <p>{returnFormDate(status.dateSubmitted)}</p>
              </div>
              <div className={`flex w-33`}>
                <p>{status.status}</p>
              </div>
              <div className={`flex w-33`}>
                <p>{status.submittedBy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default StatusHistoryTable;
