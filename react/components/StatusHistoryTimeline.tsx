/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import React, { Component } from 'react'
import { IconCheck } from 'vtex.styleguide'
import { injectIntl } from 'react-intl'

import styles from '../styles.css'
import { returnFormDate, intlArea } from '../common/utils'

interface Props {
  statusHistoryTimeline: any[]
  intlZone: string
  intl: any
}

class StatusHistoryTimeline extends Component<Props> {
  renderComment(comment: any) {
    const { intlZone } = this.props

    if (intlZone === intlArea.admin) {
      return `${comment.comment} (${comment.submittedBy}) `
    }

    return comment.comment
  }

  render() {
    const { statusHistoryTimeline } = this.props

    return (
      <div className={`${styles.requestInfoTimelineContainer}`}>
        {statusHistoryTimeline.map((currentHistory, i) => (
          <div
            className={`${styles.requestInfoTimelineStep}`}
            key={`statusHistoryTimeline_${i}`}
          >
            <p className={styles.statusLine}>
              {currentHistory.active ? (
                <span
                  className={`${styles.statusIcon} ${styles.statusIconChecked}`}
                >
                  <IconCheck size={20} color="#fff" />
                </span>
              ) : (
                <span className={`${styles.statusIcon}`} />
              )}
              <span className={`${styles.requestInfoTimelineText}`}>
                {currentHistory.text}
              </span>
            </p>
            <ul
              className={`${styles.statusUl} ${
                statusHistoryTimeline.length === i + 1
                  ? styles.statusUlLast
                  : ''
              }`}
            >
              {currentHistory.comments.map((comment) => (
                <li key={comment.id}>
                  {returnFormDate(comment.dateSubmitted)}:{' '}
                  {this.renderComment(comment)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )
  }
}

export default injectIntl(StatusHistoryTimeline)
