import React from 'react'
import { IconCheck } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import { useReturnDetails } from '../../hooks/useReturnDetails'
import { createStatusTimeline } from '../../../utils/requestStatus'

export const StatusTimeline = () => {
  const { data } = useReturnDetails()

  if (!data) return null

  const { status, refundStatusData } = data.returnRequestDetails

  const timeline = createStatusTimeline(status, refundStatusData)

  // eslint-disable-next-line no-console
  console.log({ timeline })

  return (
    <section className="mv4">
      <div className="mb5">
        {timeline.map((statusDetails) => (
          <div className="timeline" key={statusDetails.status}>
            <span className="flex items-center">
              {statusDetails.visited ? (
                <span className="status-icon status-icon-checked">
                  <IconCheck size={20} color="#fff" />
                </span>
              ) : (
                <span className="status-icon" />
              )}
              <p>{statusDetails.status}</p>
            </span>
            <ul className="status">
              {statusDetails.comments?.map((comment) => (
                <li key={comment.createdAt}>
                  <FormattedMessage
                    id="admin/return-app.return-request-details.status-timeline.comment"
                    values={{
                      ts: new Date(comment.createdAt),
                      comment: comment.comment,
                      submittedBy: comment.submittedBy,
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
