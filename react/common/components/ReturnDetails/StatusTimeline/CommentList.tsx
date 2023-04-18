import React from 'react'
import type { RefundStatusComment, UserRole } from '../../../../../typings/ReturnRequest'
import { useRuntime } from 'vtex.render-runtime'
import { FormattedMessage } from 'react-intl'
import { Tag } from 'vtex.styleguide'

interface Props {
  comments: RefundStatusComment[]
  isLast: boolean
}

interface UserCommentTagProps {
  userRole: UserRole
}

const UserCommentTag = ({ userRole }: UserCommentTagProps) => {
  return userRole === 'storeUser' ? (
    <Tag bgColor="#57bf96">Customer</Tag>
  ) : (
    <Tag bgColor="#3e60bd">Admin</Tag>
  )
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
            <div className="pa2">
              <span className="mr3">
                <FormattedMessage
                  id="admin/return-app.return-request-details.status-timeline.comment"
                  values={{
                    ts: new Date(comment.createdAt),
                    comment: comment.comment,
                    submittedBy: comment.submittedBy,
                  }}
                />
              </span>
              <UserCommentTag userRole={comment.role} />
            </div>
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
