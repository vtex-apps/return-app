import React, { useState } from 'react'
import type { ChangeEvent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Textarea } from 'vtex.styleguide'

export const UserCommentDetails = () => {
  const [comment, setComment] = useState<string | null>(null)

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    setComment(value)
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
          value={comment ?? ''}
        />
      </div>
    </div>
  )
}
