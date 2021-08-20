import type { FunctionComponent } from 'react'
import React from 'react'
import { injectIntl, defineMessages } from 'react-intl'

import styles from '../styles.css'
import { returnFormDate, getProductStatusTranslation } from '../common/utils'

interface Props {
  statusHistory: any
  intl: any
}

const StatusHistoryTable: FunctionComponent<Props> = (props) => {
  const {
    statusHistory,
    intl: { formatMessage },
  } = props

  const messages = defineMessages({
    title: { id: `returns.statusHistory` },
    date: { id: `returns.date` },
    status: { id: `returns.status` },
    submittedBy: { id: `returns.submittedBy` },
  })

  return (
    <div className={`${styles.requestInfoHistoryContainer}`}>
      <p className={`mt7 ${styles.requestInfoSectionTitle}`}>
        <strong className={`${styles.requestInfoSectionTitleStrong}`}>
          {formatMessage({ id: messages.title.id })}
        </strong>
      </p>
      <div
        className={`flex flex-column items-stretch w-100 ${styles.requestInfoHistoryContent}`}
      >
        <div
          className={`flex flex-row items-stretch w-100 ${styles.requestInfoHistoryRow}`}
        >
          <div
            className={`flex w-33 ${styles.requestInfoHistoryColumn} ${styles.requestInfoHistoryColumnHeader}`}
          >
            <p className={styles.tableThParagraph}>
              {formatMessage({ id: messages.date.id })}
            </p>
          </div>
          <div
            className={`flex w-33 ${styles.requestInfoHistoryColumn} ${styles.requestInfoHistoryColumnHeader}`}
          >
            <p className={styles.tableThParagraph}>
              {formatMessage({ id: messages.status.id })}
            </p>
          </div>
          <div
            className={`flex w-33 ${styles.requestInfoHistoryColumn} ${styles.requestInfoHistoryColumnHeader}`}
          >
            <p className={styles.tableThParagraph}>
              {formatMessage({ id: messages.submittedBy.id })}
            </p>
          </div>
        </div>
        {statusHistory.map((status, i) => (
          <div
            key={`statusHistoryTable_${i}`}
            className={`flex flex-row items-stretch w-100 ${styles.requestInfoHistoryRow}`}
          >
            <div
              className={`flex w-33 ${styles.requestInfoHistoryColumn} ${styles.requestInfoHistoryColumnDate}`}
            >
              <p
                className={`${styles.requestInfoHistoryText} ${styles.requestInfoHistoryTextDate}`}
              >
                {returnFormDate(status.dateSubmitted)}
              </p>
            </div>
            <div
              className={`flex w-33 ${styles.requestInfoHistoryColumn} ${styles.requestInfoHistoryColumnStatus}`}
            >
              <p
                className={`${styles.requestInfoHistoryText} ${styles.requestInfoHistoryTextStatus}`}
              >
                {formatMessage({
                  id: `returns.status${getProductStatusTranslation(
                    status.status
                  )}`,
                })}
              </p>
            </div>
            <div
              className={`flex w-33 ${styles.requestInfoHistoryColumn} ${styles.requestInfoHistoryColumnUpdated}`}
            >
              <p
                className={`${styles.requestInfoHistoryText} ${styles.requestInfoHistoryTextUpdated}`}
              >
                {status.submittedBy}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default injectIntl(StatusHistoryTable)
