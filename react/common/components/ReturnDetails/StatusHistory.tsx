import React from 'react'
import { Table } from 'vtex.styleguide'
import type { IntlFormatters } from 'react-intl'
import { FormattedDate, useIntl, FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'

import { useReturnDetails } from '../../hooks/useReturnDetails'
import {
  createStatusTimeline,
  statusMessageIdAdmin,
} from '../../../utils/requestStatus'

const CSS_HANDLES = ['statusHistoryContainer'] as const

const statusHistorySchema = (
  formatMessage: IntlFormatters['formatMessage'],
  isAdmin: boolean
) => ({
  properties: {
    createdAt: {
      title: (
        <FormattedMessage id="store/return-app.return-request-details.table.status-history.header.created-at" />
      ),
      minWidth: 120,
      cellRenderer: function CreatedAt({ cellData }) {
        return (
          <FormattedDate
            value={cellData}
            day="2-digit"
            month="2-digit"
            year="numeric"
            hour="numeric"
            minute="numeric"
            second="numeric"
          />
        )
      },
    },
    status: {
      title: (
        <FormattedMessage id="store/return-app.return-request-details.table.status-history.header.status" />
      ),
      minWidth: 150,
      cellRenderer: function Status({ cellData }) {
        return formatMessage(statusMessageIdAdmin[cellData])
      },
    },
    ...(isAdmin
      ? {
          submittedBy: {
            title: (
              <FormattedMessage id="store/return-app.return-request-details.table.status-history.header.submitted-by" />
            ),
          },
        }
      : null),
  },
})

export const StatusHistory = () => {
  const handles = useCssHandles(CSS_HANDLES)
  const { data } = useReturnDetails()
  const { formatMessage } = useIntl()
  const {
    route: { domain },
  } = useRuntime()

  const isAdmin = domain === 'admin'

  if (!data) return null

  const { status, refundStatusData } = data.returnRequestDetails

  const timeline = createStatusTimeline(status, refundStatusData).filter(
    ({ visited }) => visited
  )

  return (
    <section className={`${handles.statusHistoryContainer} mv4`}>
      <h3>
        <FormattedMessage id="store/return-app.return-request-details.status-history.title" />
      </h3>
      <Table
        fullWidth
        schema={statusHistorySchema(formatMessage, isAdmin)}
        items={timeline}
      />
    </section>
  )
}
