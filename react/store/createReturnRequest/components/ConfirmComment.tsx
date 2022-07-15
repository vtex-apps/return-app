import React from 'react'
import { FormattedMessage } from 'react-intl'

interface Props {
  userComment?: string | null
}

export const ConfirmComment = ({ userComment }: Props) => {
  return (
    <>
      {!userComment ? null : (
        <div className="w-40">
          <h2 className="mt0 mb6 pr6">
            <FormattedMessage id="store/return-app.confirm-and-submit.user-comment.title" />
          </h2>
          <p className="f6 gray pr6">{userComment}</p>
        </div>
      )}
    </>
  )
}
