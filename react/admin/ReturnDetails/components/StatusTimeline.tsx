import React from 'react'
import { IconSuccess, IconClear } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'

import { useReturnDetails } from '../../hooks/useReturnDetails'
import { createStatusTimeline } from '../../../utils/requestStatus'

export const StatusTimeline = () => {
  const { data } = useReturnDetails()
  const {
    route: { domain },
  } = useRuntime()

  const contextDomain: 'store' | 'admin' = domain

  if (!data) return null

  const { status, refundStatusData } = data.returnRequestDetails

  const timeline = createStatusTimeline(status, refundStatusData)

  return (
    <section className="mv8">
      <h3>
        <FormattedMessage id="admin/return-app.return-request-details.status-timeline.header" />
      </h3>
      <div className="mb5">
        {timeline.map((statusDetails, index) => (
          <div className="timeline" key={statusDetails.status}>
            <span className="flex items-center">
              {statusDetails.visited ? (
                <span className="flex status-icon">
                  {statusDetails.status === 'denied' ? (
                    <IconClear size={26} color="#f21515" />
                  ) : (
                    <IconSuccess size={26} color="#134cd8" />
                  )}
                </span>
              ) : (
                <span className="status-icon-not-visited" />
              )}
              <p>{statusDetails.status}</p>
            </span>
            <ul
              className={`status ${
                index === timeline.length - 1 && statusDetails.comments?.length
                  ? ''
                  : 'last-of'
              }`}
            >
              {statusDetails.comments?.map((comment) => (
                <li key={comment.createdAt}>
                  {contextDomain === 'admin' ? (
                    <FormattedMessage
                      id="admin/return-app.return-request-details.status-timeline.comment"
                      values={{
                        ts: new Date(comment.createdAt),
                        comment: comment.comment,
                        submittedBy: comment.submittedBy,
                      }}
                    />
                  ) : null}
                  {contextDomain === 'store' ? (
                    <FormattedMessage
                      id="store/return-app.return-request-details.status-timeline.comment"
                      values={{
                        ts: new Date(comment.createdAt),
                        comment: comment.comment,
                        submittedBy: comment.submittedBy,
                      }}
                    />
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
