import React, { useState } from 'react'
import type { ChangeEvent } from 'react'
import { useIntl, defineMessages } from 'react-intl'
import { Input } from 'vtex.styleguide'

const messages = defineMessages({
  contactDetails: {
    id: 'store/return-app.return-order-details.title.contact-details',
  },
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
  const [formInputs, setFormInputs] = useState({
    name: '',
    email: '',
    phone: '',
  })

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target } = event
    const { name, value } = target

    setFormInputs((prevState) => ({ ...prevState, [name]: value }))
  }

  return (
    <div className="flex-ns flex-wrap flex-auto flex-column pa4">
      <p>{formatMessage(messages.contactDetails)}</p>
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
          placeholder="email"
          onChange={handleInputChange}
          value={formInputs.email}
        />
      </div>
      <div className="mb4">
        <Input
          name="phone"
          placeholder="Phone"
          onChange={handleInputChange}
          value={formInputs.phone}
        />
      </div>
    </div>
  )
}
