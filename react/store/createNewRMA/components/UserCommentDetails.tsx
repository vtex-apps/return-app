import React from 'react'
import type { ChangeEvent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Textarea } from 'vtex.styleguide'

import { useReturnRequest } from '../../hooks/useReturnRequest'

export const UserCommentDetails = () => {
  const {
    returnRequest,
    actions: { updateReturnRequest },
  } = useReturnRequest()

  const { userComment } = returnRequest

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    updateReturnRequest({
      type: 'updateUserComment',
      payload: value,
    })
  }

  return (
    <div className="mt4 ph4">
      <p>
        <FormattedMessage id="store/return-app.return-order-details.title.extra-comment" />
      </p>
      <div>
        <Textarea
          name="extraComment"
          resize="none"
          onChange={handleInputChange}
          maxLength="300"
          value={userComment ?? ''}
        />
      </div>
    </div>
  )
}
