import React from 'react'
import type { ChangeEvent } from 'react'
import { useIntl, defineMessages, FormattedMessage } from 'react-intl'
import { Input } from 'vtex.styleguide'

import { useReturnRequest } from '../../hooks/useReturnRequest'

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

  const {
    returnRequest,
    actions: { updateReturnRequest },
  } = useReturnRequest()

  const { pickupReturnData } = returnRequest

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target } = event
    const { name, value } = target

    updateReturnRequest({
      type: 'updatePickupReturnData',
      payload: { ...pickupReturnData, [name]: value },
    })
  }

  /**
   * Important note: If the address from order has type PICKUP_POINT, the fields will be empty in the initial render.
   * More explanation on setInitialPickupAddress util function
   */
  return (
    <div className="flex-ns flex-wrap flex-auto flex-column pa4">
      <p>
        <FormattedMessage id="store/return-app.return-order-details.title.pickup-address" />
      </p>
      <div className="mb4">
        <Input
          name="address"
          required
          placeholder={formatMessage(messages.addressInput)}
          onChange={handleInputChange}
          value={pickupReturnData.address}
        />
      </div>
      <div className="mb4">
        <Input
          name="city"
          required
          placeholder={formatMessage(messages.cityInput)}
          onChange={handleInputChange}
          value={pickupReturnData.city}
        />
      </div>
      <div className="mb4">
        <Input
          name="state"
          requiered
          placeholder={formatMessage(messages.stateInput)}
          onChange={handleInputChange}
          value={pickupReturnData.state}
        />
      </div>
      <div className="mb4">
        <Input
          name="zip"
          required
          placeholder={formatMessage(messages.zipInput)}
          onChange={handleInputChange}
          value={pickupReturnData.zipCode}
        />
      </div>
      <div className="mb4">
        <Input
          name="country"
          required
          placeholder={formatMessage(messages.countryInput)}
          onChange={handleInputChange}
          value={pickupReturnData.country}
        />
      </div>
    </div>
  )
}
