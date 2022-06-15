import React from 'react'
import { FormattedMessage } from 'react-intl'

import { useReturnDetails } from '../../hooks/useReturnDetails'

export const ContactDetails = () => {
  const { data } = useReturnDetails()

  if (!data) return null

  const {
    returnRequestDetails: {
      customerProfileData: { name, email, phoneNumber },
    },
  } = data

  const messagesRoute =
    'admin/return-app.return-request-details.contact-details'

  return (
    <section className="flex-ns flex-wrap flex-auto flex-column pt4 pb4">
      <h3>
        <FormattedMessage id={`${messagesRoute}.title`} />
      </h3>
      <div className="mb5">
        <p className="ma0">
          <FormattedMessage id={`${messagesRoute}.name`} />: {name}
        </p>
      </div>
      <div className="mb5">
        <p className="ma0">
          <FormattedMessage id={`${messagesRoute}.email`} />: {email}
        </p>
      </div>
      <div className="mb5">
        <p className="ma0">
          <FormattedMessage id={`${messagesRoute}.phone`} />: {phoneNumber}
        </p>
      </div>
    </section>
  )
}
