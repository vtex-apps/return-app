import React from 'react'
import type { ChangeEvent } from 'react'
import { useIntl, defineMessages, FormattedMessage } from 'react-intl'
import { Input } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import { useReturnRequest } from '../../hooks/useReturnRequest'
import { CustomMessage } from './layout/CustomMessage'

const messages = defineMessages({
  nameInput: {
    id: 'return-app.return-order-details.inputs.name-input',
  },
  emailInput: {
    id: 'return-app.return-order-details.inputs.email-input',
  },
  phoneInput: {
    id: 'return-app.return-order-details.inputs.phone-input',
  },
})

const CSS_HANDLES = [
  'contactDetailsContainer',
  'contactDetailsTitle',
  'contactNameInputWrapper',
  'contactEmailInputWrapper',
  'contactPhoneInputWrapper',
] as const


export const ContactDetails = () => {
  const handles = useCssHandles(CSS_HANDLES)
  
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
    <div
      className={`${handles.contactDetailsContainer} flex-ns flex-wrap flex-auto flex-column pa4`}
    >
      <p className={`${handles.contactDetailsContainer}`}>
        <FormattedMessage id="return-app.return-order-details.title.contact-details" />
      </p>
      <div className={`${handles.contactNameInputWrapper} mb4`}>
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
            message={
              <FormattedMessage id="return-app.return-contact-details.name-input.error" />
            }
          />
        ) : null}
      </div>
      <div className={`${handles.contactEmailInputWrapper} mb4`}>
        <Input
          readOnly
          name="email"
          placeholder={formatMessage(messages.emailInput)}
          onChange={handleInputChange}
          value={email}
        />
      </div>
      <div className={`${handles.contactPhoneInputWrapper} mb4`}>
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
            message={
              <FormattedMessage id="return-app.return-contact-details.phone-input.error" />
            }
          />
        ) : null}
      </div>
    </div>
  )
}
