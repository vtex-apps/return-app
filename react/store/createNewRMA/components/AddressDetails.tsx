import React, { useState } from 'react'
import type { ChangeEvent } from 'react'
import { useIntl, defineMessages } from 'react-intl'
import { Input, Textarea } from 'vtex.styleguide'

const messages = defineMessages({
  pickupAddress: {
    id: 'store/return-app.return-order-details.title.pickup-address',
  },
  extraComment: {
    id: 'store/return-app.return-order-details.title.extra-comment',
  },
  addressInput: {
    id: 'store/return-app.return-order-details.inputs.address-input',
  },
  localityInput: {
    id: 'store/return-app.return-order-details.inputs.locality-input',
  },
  stateInput: {
    id: 'store/return-app.return-order-details.inputs.state-input',
  },
  zipInput: {
    id: 'store/return-app.return-order-details.inputs.zip-input',
  },
  countryInput: {
    id: 'store/return-app.return-order-details.inputs.country-input',
  },
})

export const AddressDetails = () => {
  const { formatMessage } = useIntl()
  const [formInputs, setFormInputs] = useState({
    country: '',
    locality: '',
    address: '',
    state: '',
    zip: '',
    extraComment: '',
  })

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target } = event
    const { name, value } = target

    setFormInputs((prevState) => ({ ...prevState, [name]: value }))
  }

  return (
    <>
      <div className="flex-ns flex-wrap flex-auto flex-column pa4">
        <p>{formatMessage(messages.pickupAddress)}</p>
        <div className="mb4">
          <Input
            name="address"
            placeholder={formatMessage(messages.addressInput)}
            onChange={handleInputChange}
            value={formInputs.address}
          />
        </div>
        <div className="mb4">
          <Input
            name="locality"
            placeholder={formatMessage(messages.localityInput)}
            onChange={handleInputChange}
            value={formInputs.locality}
          />
        </div>
        <div className="mb4">
          <Input
            name="state"
            placeholder={formatMessage(messages.stateInput)}
            onChange={handleInputChange}
            value={formInputs.state}
          />
        </div>
        <div className="mb4">
          <Input
            name="zip"
            placeholder={formatMessage(messages.zipInput)}
            onChange={handleInputChange}
            value={formInputs.zip}
          />
        </div>
        <div className="mb4">
          <Input
            name="country"
            placeholder={formatMessage(messages.countryInput)}
            onChange={handleInputChange}
            value={formInputs.country}
          />
        </div>
      </div>
      <div className="mt4 ph4">
        <p>{formatMessage(messages.extraComment)}</p>
        <div>
          <Textarea
            name="extraComment"
            resize="none"
            onChange={handleInputChange}
            maxLength="250"
            value={formInputs.extraComment}
          />
        </div>
      </div>
    </>
  )
}
