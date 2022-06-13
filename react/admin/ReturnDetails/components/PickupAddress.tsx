import React from 'react'
import { FormattedMessage } from 'react-intl'

import { useReturnDetails } from '../../hooks/useReturnDetails'

export const PickupAddress = () => {
  const { data } = useReturnDetails()

  if (!data) return null

  const {
    returnRequestDetails: {
      pickupReturnData: { country, state, address, zipCode, city, addressType },
    },
  } = data

  return (
    <section className="flex-ns flex-wrap flex-auto flex-column pt4 pb4">
      <h3>
        <FormattedMessage id="admin/return-app.return-request-details.pickup-address.title" />
      </h3>
      <div className="mb5">
        <p className="ma0">
          <FormattedMessage id="returns.pickup-address-type" />:{' '}
          {addressType === 'PICKUP_POINT' ? (
            <FormattedMessage id="returns.pickup-address-types.pickup-point" />
          ) : (
            <FormattedMessage id="returns.pickup-address-types.customer-address" />
          )}
        </p>
      </div>
      <div className="mb5">
        <p className="ma0">
          <FormattedMessage id="returns.country" />: {country}
        </p>
      </div>
      <div className="mb5">
        <p className="ma0">
          <FormattedMessage id="returns.locality" />: {city}
        </p>
      </div>
      <div className="mb5">
        <p className="ma0">
          <FormattedMessage id="returns.address" />: {address}
        </p>
      </div>
      <div className="mb5">
        <p className="ma0">
          <FormattedMessage id="returns.state" />: {state}
        </p>
      </div>
      <div className="mb5">
        <p className="ma0">
          <FormattedMessage id="returns.zip" />: {zipCode}
        </p>
      </div>
    </section>
  )
}
