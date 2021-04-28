import React, { Component } from "react";
import styles from "../styles.css";
import { returnFormDate, intlArea } from "../common/utils";
import { IconCheck } from "vtex.styleguide";

interface Props {
  statusHistoryTimeline: any;
  intl: string;
}

class StatusHistoryTimeline extends Component<Props> {
  constructor(props) {
    super(props);
  }

  renderComment(comment: any) {
    const { intl } = this.props;
    if (intl === intlArea.admin) {
      return comment.comment + " (" + comment.submittedBy + ") ";
    }
    return comment.comment;
  }

  render() {
    const { statusHistoryTimeline, intl } = this.props;
    return (
      <div className={`${styles.requestInfoTimelineContainer}`}>
        {statusHistoryTimeline.map((currentHistory, i) => (
          <div
            className={`${styles.requestInfoTimelineStep}`}
            key={`statusHistoryTimeline_` + i}
          >
            <p className={styles.statusLine}>
              {currentHistory.active ? (
                <span
                  className={`${styles.statusIcon} ${styles.statusIconChecked}`}
                >
                  <IconCheck size={20} color={"#fff"} />
                </span>
              ) : (
                <span className={`${styles.statusIcon}`} />
              )}
              <span className={`${styles.requestInfoTimelineText}`}>{currentHistory.text}</span>
            </p>
            <ul
              className={
                styles.statusUl +
                " " +
                (statusHistoryTimeline.length === i + 1
                  ? styles.statusUlLast
                  : "")
              }
            >
              {currentHistory.comments.map(comment => (
                <li key={comment.id}>
                  {returnFormDate(comment.dateSubmitted, intl)}:{" "}
                  {this.renderComment(comment)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }
}

export default StatusHistoryTimeline;
