import React, { useState } from 'react'
import type { ChangeEvent } from 'react'
import { useIntl, defineMessages, FormattedMessage } from 'react-intl'
import { Input, Tooltip, Toggle, IconInfo } from 'vtex.styleguide'

import { useReturnRequest } from '../../hooks/useReturnRequest'
import { useStoreSettings } from '../../hooks/useStoreSettings'
import { CustomMessage } from './layout/CustomMessage'
import { AddressDetailsPickupPoints } from './AddressDetailsPickupPoints'

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

interface Props {
  geoCoordinates?: GeoCoordinates
}

export const AddressDetails = ({ geoCoordinates }: Props) => {
  const { formatMessage } = useIntl()
  const { data: settings } = useStoreSettings()
  const [isPickupPointSelected, setIsPickupPointSelected] = useState(false)

  const {
    returnRequest,
    inputErrors,
    actions: { updateReturnRequest },
  } = useReturnRequest()

  const { pickupReturnData } = returnRequest

  const handleSelectedToggleAddress = () => {
    setIsPickupPointSelected(!isPickupPointSelected)

    if (!isPickupPointSelected) {
      updateReturnRequest({
        type: 'updatePickupReturnData',
        payload: { ...pickupReturnData },
      })
    }
  }

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
      <div className="flex items-center justify-between">
        {!settings?.options?.enablePickupPoints ? (
          <div>
            <p>
              <FormattedMessage id="store/return-app.return-order-details.title.pickup-address" />
            </p>
          </div>
        ) : (
          <>
            <div>
              <p>
                <FormattedMessage id="store/return-app.return-order-details.title.pickup-address" />
              </p>
            </div>
            <div className="flex items-center">
              <Tooltip
                label={
                  <FormattedMessage id="store/return-app.return-order-details.title.pickup-address" />
                }
                position="left"
              >
                <span className="flex items-center">
                  <IconInfo className="ml5 o-50" />
                  <p className="ml2 mr3">Dropoff Point</p>
                </span>
              </Tooltip>
              <Toggle
                checked={isPickupPointSelected}
                onChange={handleSelectedToggleAddress}
              />
            </div>
          </>
        )}
      </div>
      {isPickupPointSelected && geoCoordinates ? (
        <AddressDetailsPickupPoints geoCoordinates={geoCoordinates} />
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}
