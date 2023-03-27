import React, { useState } from 'react'
import type { ChangeEvent } from 'react'
import { useIntl, defineMessages, FormattedMessage } from 'react-intl'
import { Input, Tooltip, Toggle, IconInfo } from 'vtex.styleguide'
import type { AddressType, ShippingData } from 'vtex.return-app'
import { useCssHandles } from 'vtex.css-handles'

import { useReturnRequest } from '../../hooks/useReturnRequest'
import { useStoreSettings } from '../../hooks/useStoreSettings'
import { CustomMessage } from './layout/CustomMessage'
import { PickupPointSelector } from './PickupPointSelector'
import type { OrderDetailsState } from '../../provider/OrderToReturnReducer'
import { setInitialPickupAddress } from '../../utils/setInitialPickupAddress'

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
  shippingData: ShippingData
}

const CSS_HANDLES = [
  'addressContainer',
  'addressHeaderWrapper',
  'pickupAddressTitle',
  'tooltipToggleWrapper',
  'addressInputContainer',
  'cityInputContainer',
  'stateInputContainer',
  'zipCodeInputContainer',
  'countryInputContainer',
] as const

export const AddressDetails = ({ shippingData }: Props) => {
  const { formatMessage } = useIntl()
  const { data: settings } = useStoreSettings()
  const handles = useCssHandles(CSS_HANDLES)

  const { geoCoordinates } = shippingData ?? {}

  const [customerAddress, setCustomerAddress] = useState<
    OrderDetailsState['pickupReturnData'] | null
  >(null)

  const {
    returnRequest,
    inputErrors,
    actions: { updateReturnRequest },
  } = useReturnRequest()

  const { pickupReturnData } = returnRequest

  const [pickupPointType, setPickupPointType] = useState<AddressType>(
    pickupReturnData.addressType ?? 'CUSTOMER_ADDRESS'
  )

  const handleSelectedToggleAddress = () => {
    const addressType =
      pickupPointType === 'CUSTOMER_ADDRESS'
        ? 'PICKUP_POINT'
        : 'CUSTOMER_ADDRESS'

    // When user toggles to select a pickup point, we save the current CUSTOMER_ADDRESS into state in case they come back.
    if (addressType === 'PICKUP_POINT') {
      setCustomerAddress(pickupReturnData)

      updateReturnRequest({
        type: 'resetAddress',
      })
    }

    // When toggling back to CUSTOMER_ADDRESS, we restore the previous entered address.
    if (addressType === 'CUSTOMER_ADDRESS') {
      updateReturnRequest({
        type: 'updatePickupReturnData',
        payload: customerAddress ?? setInitialPickupAddress(shippingData),
      })
    }

    setPickupPointType(addressType)
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    updateReturnRequest({
      type: 'updatePickupReturnData',
      payload: {
        ...pickupReturnData,
        addressType: pickupPointType,
        [name]: value,
      },
    })
  }

  const addressError = inputErrors.some((error) => error === 'pickup-data')
  const isPickupPoint = pickupPointType === 'PICKUP_POINT'

  /**
   * Important note: If the address from order has type PICKUP_POINT, the fields will be empty in the initial render.
   * More explanation on setInitialPickupAddress util function
   */
  return (
    <div
      className={`${handles.addressContainer} flex-ns flex-wrap flex-auto flex-column pa4 mw6`}
    >
      <div
        className={`${handles.addressHeaderWrapper} flex items-center justify-between`}
      >
        <div>
          <Tooltip
            label={
              <FormattedMessage id="return-app.return-order-details.title.tooltip.pickup-address" />
            }
          >
            <p className={handles.pickupAddressTitle}>
              <FormattedMessage id="return-app.return-order-details.title.pickup-address" />
            </p>
          </Tooltip>
        </div>
        {!settings?.options?.enablePickupPoints || !geoCoordinates ? null : (
          <div className={`${handles.tooltipToggleWrapper} flex items-center`}>
            <Tooltip
              label={
                <FormattedMessage id="return-app.return-order-details.pickup-address.drop-off-points.tooltip" />
              }
              position="left"
            >
              <div className="flex items-center">
                <span className="yellow">
                  <IconInfo className=" ml5 o-50" />
                </span>
                <p className="ml2 mr3">
                  <FormattedMessage id="return-app.return-order-details.pickup-address.drop-off-points" />
                </p>
              </div>
            </Tooltip>
            <Toggle
              checked={isPickupPoint}
              onChange={handleSelectedToggleAddress}
            />
          </div>
        )}
      </div>
      {isPickupPoint && geoCoordinates ? (
        <PickupPointSelector geoCoordinates={geoCoordinates} />
      ) : null}

      <div className={`${handles.addressInputContainer} mb4`}>
        <Input
          name="address"
          required
          placeholder={formatMessage(messages.addressInput)}
          onChange={handleInputChange}
          value={pickupReturnData.address}
          readOnly={isPickupPoint}
        />
        {addressError && !pickupReturnData.address ? (
          <CustomMessage
            status="error"
            message={
              <FormattedMessage id="return-app.return-address-details.address-input.error" />
            }
          />
        ) : null}
      </div>
      <div className={`${handles.cityInputContainer} mb4`}>
        <Input
          name="city"
          required
          placeholder={formatMessage(messages.cityInput)}
          onChange={handleInputChange}
          value={pickupReturnData.city}
          readOnly={isPickupPoint}
        />
        {addressError && !pickupReturnData.city ? (
          <CustomMessage
            status="error"
            message={
              <FormattedMessage id="return-app.return-address-details.city-input.error" />
            }
          />
        ) : null}
      </div>
      <div className={`${handles.stateInputContainer} mb4`}>
        <Input
          name="state"
          requiered
          placeholder={formatMessage(messages.stateInput)}
          onChange={handleInputChange}
          value={pickupReturnData.state}
          readOnly={isPickupPoint}
        />
        {addressError && !pickupReturnData.state ? (
          <CustomMessage
            status="error"
            message={
              <FormattedMessage id="return-app.return-address-details.state-input.error" />
            }
          />
        ) : null}
      </div>
      <div className={`${handles.zipCodeInputContainer} mb4`}>
        <Input
          name="zipCode"
          required
          placeholder={formatMessage(messages.zipInput)}
          onChange={handleInputChange}
          value={pickupReturnData.zipCode}
          readOnly={isPickupPoint}
        />
        {addressError && !pickupReturnData.zipCode ? (
          <CustomMessage
            status="error"
            message={
              <FormattedMessage id="return-app.return-address-details.zip-input.error" />
            }
          />
        ) : null}
      </div>
      <div className={`${handles.countryInputContainer} mb4`}>
        <Input
          name="country"
          required
          placeholder={formatMessage(messages.countryInput)}
          onChange={handleInputChange}
          value={pickupReturnData.country}
          readOnly={isPickupPoint}
        />
        {addressError && !pickupReturnData.country ? (
          <CustomMessage
            status="error"
            message={
              <FormattedMessage id="return-app.return-address-details.country-input.error" />
            }
          />
        ) : null}
      </div>
    </div>
  )
}
