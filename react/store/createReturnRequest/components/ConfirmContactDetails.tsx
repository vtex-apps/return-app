import React from 'react'
import { FormattedMessage } from 'react-intl'
import type { CustomerProfileDataInput } from 'vtex.return-app'

interface Props {
  contactDetails: CustomerProfileDataInput
}

export const ConfirmContactDetails = ({ contactDetails }: Props) => {
  return (
    <div className="w-40">
      <h2 className="mt0 mb6">
        <FormattedMessage id="store/return-app.confirm-and-submit.contact-details.title" />
      </h2>
      <p className="f6 gray">{contactDetails.name}</p>
      <p className="f6 gray">{contactDetails.email}</p>
      <p className="f6 gray">{contactDetails.phoneNumber}</p>
    </div>
  )
}
