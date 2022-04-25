import React, { useState } from 'react'
import type { ChangeEvent } from 'react'
import { useIntl, defineMessages, FormattedMessage } from 'react-intl'
import { Input } from 'vtex.styleguide'
import type { PickupReturnDataInput } from 'vtex.return-app'

const messages = defineMessages({
  addressInput: {
    id: 'store/return-app.return-order-details.inputs.address-input',
  },
  cityInput: {
    id: 'store/return-app.return-order-details.inputs.city-input',
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
  const [formInputs, setFormInputs] = useState<PickupReturnDataInput>({
    country: '',
    city: '',
    address: '',
    addressId: 'ABC',
    addressType: 'PICKUP_POINT',
    state: '',
    zipCode: '',
  })

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target } = event
    const { name, value } = target

    setFormInputs((prevState) => ({ ...prevState, [name]: value }))
  }

  return (
    <div className="flex-ns flex-wrap flex-auto flex-column pa4">
      <p>
        <FormattedMessage id="store/return-app.return-order-details.title.pickup-address" />
      </p>
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
          name="city"
          placeholder={formatMessage(messages.cityInput)}
          onChange={handleInputChange}
          value={formInputs.city}
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
          value={formInputs.zipCode}
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
  )
}
