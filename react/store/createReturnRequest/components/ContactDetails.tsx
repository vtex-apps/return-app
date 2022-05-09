import React from 'react'
import type { ChangeEvent } from 'react'
import { useIntl, defineMessages, FormattedMessage } from 'react-intl'
import { Input } from 'vtex.styleguide'

import { useReturnRequest } from '../../hooks/useReturnRequest'
import { CustomMessage } from './layout/CustomMessage'

const messages = defineMessages({
  nameInput: {
    id: 'store/return-app.return-order-details.inputs.name-input',
  },
  emailInput: {
    id: 'store/return-app.return-order-details.inputs.email-input',
  },
  phoneInput: {
    id: 'store/return-app.return-order-details.inputs.phone-input',
  },
})

export const ContactDetails = () => {
  const {
    returnRequest: { customerProfileData },
    inputErrors,
    actions: { updateReturnRequest },
  } = useReturnRequest()

  const { name, email, phoneNumber } = customerProfileData

  const { formatMessage } = useIntl()

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name: fieldName, value } = event.target

    updateReturnRequest({
      type: 'updateCustomerProfileData',
      payload: {
        ...customerProfileData,
        [fieldName]: value,
      },
    })
  }

  const contactError = inputErrors.some((error) => error === 'customer-data')

  return (
    <div className="flex-ns flex-wrap flex-auto flex-column pa4">
      <p>
        <FormattedMessage id="store/return-app.return-order-details.title.contact-details" />
      </p>
      <div className="mb4">
        <Input
          name="name"
          required
          placeholder={formatMessage(messages.nameInput)}
          onChange={handleInputChange}
          value={name}
        />
        {contactError && !name ? (
          <CustomMessage
            status="error"
            message="store/return-app.return-contact-details.name-input.error"
          />
        ) : null}
      </div>
      <div className="mb4">
        <Input
          disabled
          name="email"
          placeholder={formatMessage(messages.emailInput)}
          onChange={handleInputChange}
          value={email}
        />
      </div>
      <div className="mb4">
        <Input
          name="phoneNumber"
          required
          placeholder={formatMessage(messages.phoneInput)}
          onChange={handleInputChange}
          value={phoneNumber}
          maxLength={50}
        />
        {contactError && !phoneNumber ? (
          <CustomMessage
            status="error"
            message="store/return-app.return-contact-details.phone-input.error"
          />
        ) : null}
      </div>
    </div>
  )
}
