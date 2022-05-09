import React from 'react'
import type { ChangeEvent } from 'react'
import { useIntl, defineMessages, FormattedMessage } from 'react-intl'
import { Input } from 'vtex.styleguide'

import { CustomMessage } from './layout/CustomMessage'
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
    inputErrors,
    actions: { updateReturnRequest },
  } = useReturnRequest()

  const { pickupReturnData } = returnRequest

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    updateReturnRequest({
      type: 'updatePickupReturnData',
      payload: { ...pickupReturnData, [name]: value },
    })
  }

  const addressError = inputErrors.some((error) => error === 'pickup-data')

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
        {addressError && !pickupReturnData.address ? (
          <CustomMessage
            status="error"
            message="store/return-app.return-address-details.address-input.error"
          />
        ) : null}
      </div>
      <div className="mb4">
        <Input
          name="city"
          required
          placeholder={formatMessage(messages.cityInput)}
          onChange={handleInputChange}
          value={pickupReturnData.city}
        />
        {addressError && !pickupReturnData.city ? (
          <CustomMessage
            status="error"
            message="store/return-app.return-address-details.city-input.error"
          />
        ) : null}
      </div>
      <div className="mb4">
        <Input
          name="state"
          requiered
          placeholder={formatMessage(messages.stateInput)}
          onChange={handleInputChange}
          value={pickupReturnData.state}
        />
        {addressError && !pickupReturnData.state ? (
          <CustomMessage
            status="error"
            message="store/return-app.return-address-details.state-input.error"
          />
        ) : null}
      </div>
      <div className="mb4">
        <Input
          name="zipCode"
          required
          placeholder={formatMessage(messages.zipInput)}
          onChange={handleInputChange}
          value={pickupReturnData.zipCode}
        />
        {addressError && !pickupReturnData.zipCode ? (
          <CustomMessage
            status="error"
            message="store/return-app.return-address-details.zip-input.error"
          />
        ) : null}
      </div>
      <div className="mb4">
        <Input
          name="country"
          required
          placeholder={formatMessage(messages.countryInput)}
          onChange={handleInputChange}
          value={pickupReturnData.country}
        />
        {addressError && !pickupReturnData.country ? (
          <CustomMessage
            status="error"
            message="store/return-app.return-address-details.country-input.error"
          />
        ) : null}
      </div>
    </div>
  )
}
