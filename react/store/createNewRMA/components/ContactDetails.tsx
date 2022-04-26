import React, { useState } from 'react'
import type { ChangeEvent } from 'react'
import { useIntl, defineMessages, FormattedMessage } from 'react-intl'
import { Input } from 'vtex.styleguide'
import type { CustomerProfileDataInput } from 'vtex.return-app'

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
  const { formatMessage } = useIntl()
  const [formInputs, setFormInputs] = useState<CustomerProfileDataInput>({
    name: '',
    email: '',
    phoneNumber: '',
  })

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setFormInputs((prevState) => ({ ...prevState, [name]: value }))
  }

  return (
    <div className="flex-ns flex-wrap flex-auto flex-column pa4">
      <p>
        <FormattedMessage id="store/return-app.return-order-details.title.contact-details" />
      </p>
      <div className="mb4">
        <Input
          name="name"
          placeholder={formatMessage(messages.nameInput)}
          onChange={handleInputChange}
          value={formInputs.name}
        />
      </div>
      <div className="mb4">
        <Input
          disabled
          name="email"
          placeholder={formatMessage(messages.emailInput)}
          onChange={handleInputChange}
          value={formInputs.email}
        />
      </div>
      <div className="mb4">
        <Input
          name="phoneNumber"
          placeholder={formatMessage(messages.phoneInput)}
          onChange={handleInputChange}
          value={formInputs.phoneNumber}
          maxLength={50}
        />
      </div>
    </div>
  )
}
