import React from 'react'
import type { ChangeEvent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Textarea } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import { useReturnRequest } from '../../hooks/useReturnRequest'

const CSS_HANDLES = ['userCommentDetailsContainer'] as const

export const UserCommentDetails = () => {
  const {
    returnRequest,
    actions: { updateReturnRequest },
  } = useReturnRequest()

  const handles = useCssHandles(CSS_HANDLES)

  const { userComment } = returnRequest

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    updateReturnRequest({
      type: 'updateUserComment',
      payload: value,
    })
  }

  return (
    <div className={`${handles.userCommentDetailsContainer} mt4 ph4`}>
      <p>
        <FormattedMessage id="return-app.return-order-details.title.extra-comment" />
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
