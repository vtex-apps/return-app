import React from 'react'
import type { RefundStatusComment } from 'vtex.return-app'
import { useRuntime } from 'vtex.render-runtime'
import { FormattedMessage } from 'react-intl'

interface Props {
  comments: RefundStatusComment[]
  isLast: boolean
}
export const CommentList = ({ comments, isLast }: Props) => {
  const {
    route: { domain },
  } = useRuntime()

  const contextDomain: 'store' | 'admin' = domain

  return (
    <ul className={`status ${isLast && comments?.length ? '' : 'last-of'}`}>
      {comments?.map((comment) => (
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
              }}
            />
          ) : null}
        </li>
      ))}
    </ul>
  )
}
