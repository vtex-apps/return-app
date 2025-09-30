import React from 'react'
import { FormattedMessage, defineMessages } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { useReturnDetails } from '../hooks/useReturnDetails'

const CSS_HANDLES = ['contactDetailsCommonContainer'] as const

export const ContactDetails = () => {
  const handles = useCssHandles(CSS_HANDLES)

  const { data } = useReturnDetails()

  if (!data) return null

  const {
    returnRequestDetails: {
      customerProfileData: { name, email, phoneNumber },
    },
  } = data

  const messagesRoute = 'return-app.return-request-details.contact-details'

  const messages = defineMessages({
    [`${messagesRoute}.title`]: {
      id: `${messagesRoute}.title`,
      defaultMessage: 'Contact Details'
    },
    [`${messagesRoute}.name`]: {
      id: `${messagesRoute}.name`,
      defaultMessage: 'Name'
    },
    [`${messagesRoute}.email`]: {
      id: `${messagesRoute}.email`,
      defaultMessage: 'Email'
    },
    [`${messagesRoute}.phone`]: {
      id: `${messagesRoute}.phone`,
      defaultMessage: 'Phone'
    }
  })

  return (
    <section
      className={`${handles.contactDetailsCommonContainer} flex-ns flex-wrap flex-auto flex-column pt4 pb4`}
    >
      <h3>
        <FormattedMessage {...messages[`${messagesRoute}.title`]} />
      </h3>
      <div className="mb5">
        <p className="ma0">
          <FormattedMessage {...messages[`${messagesRoute}.name`]} />: {name}
        </p>
      </div>
      <div className="mb5">
        <p className="ma0">
          <FormattedMessage {...messages[`${messagesRoute}.email`]} />: {email}
        </p>
      </div>
      <div className="mb5">
        <p className="ma0">
          <FormattedMessage {...messages[`${messagesRoute}.phone`]} />: {phoneNumber}
        </p>
      </div>
    </section>
  )
}
