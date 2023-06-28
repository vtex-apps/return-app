import React from 'react'
import { FormattedMessage } from 'react-intl'

import { useReturnDetails } from '../../../hooks/useReturnDetails'
import { createStatusTimeline } from '../../../../utils/requestStatus'
import { StatusTag } from './StatusTag'
import { CommentList } from './CommentList'

export const StatusTimeline = () => {
  const { data } = useReturnDetails()

  if (!data) return null

  const { status, refundStatusData } = data.returnRequestDetails

  const timeline = createStatusTimeline(status, refundStatusData)

  return (
    <section className="mv8">
      <h3>
        <FormattedMessage id="store/return-app.return-request-details.status-timeline.header" />
      </h3>
      <div className="mb5">
        {timeline.map((statusDetails, index) => (
          <div className="timeline" key={statusDetails.status}>
            <StatusTag
              status={statusDetails.status}
              visited={statusDetails.visited}
              createdAt={statusDetails.createdAt}
            />
            <CommentList
              comments={statusDetails?.comments ?? []}
              isLast={index === timeline.length - 1}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
