import React, { Component } from "react";
import styles from "../styles.css";
import {
  returnFormDate,
  FormattedMessageFixed,
  getProductStatusTranslation
} from "../common/utils";

interface Props {
  statusHistory: any;
  intl: string;
}

class StatusHistoryTable extends Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const { statusHistory, intl } = this.props;
    const messages = {
      title: `${intl}.statusHistory`,
      date: `${intl}.date`,
      status: `${intl}.status`,
      submittedBy: `${intl}.submittedBy`
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
                <p>{returnFormDate(status.dateSubmitted, intl)}</p>
              </div>
              <div className={`flex w-33`}>
                <p>
                  <FormattedMessageFixed
                    id={
                      `${intl}.status` +
                      getProductStatusTranslation(status.status)
                    }
                  />
                </p>
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
