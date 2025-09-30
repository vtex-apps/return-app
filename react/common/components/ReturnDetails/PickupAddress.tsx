import React from 'react'
import { FormattedMessage, defineMessages } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { useReturnDetails } from '../../hooks/useReturnDetails'

const CSS_HANDLES = ['commonPickupContainer'] as const

export const PickupAddress = () => {
  const { data } = useReturnDetails()
  const handles = useCssHandles(CSS_HANDLES)

  if (!data) return null

  const {
    returnRequestDetails: {
      pickupReturnData: { country, state, address, zipCode, city, addressType },
    },
  } = data

  const pickupAddressMessageRoute =
    'return-app.return-request-details.pickup-address'

  const messages = defineMessages({
    [`${pickupAddressMessageRoute}.title`]: {
      id: `${pickupAddressMessageRoute}.title`,
      defaultMessage: 'Pickup Address'
    },
    [`${pickupAddressMessageRoute}.pickup-type`]: {
      id: `${pickupAddressMessageRoute}.pickup-type`,
      defaultMessage: 'Pickup Type'
    },
    [`${pickupAddressMessageRoute}.pickup-type.pickup-point`]: {
      id: `${pickupAddressMessageRoute}.pickup-type.pickup-point`,
      defaultMessage: 'Pickup Point'
    },
    [`${pickupAddressMessageRoute}.pickup-type.customer-address`]: {
      id: `${pickupAddressMessageRoute}.pickup-type.customer-address`,
      defaultMessage: 'Customer Address'
    },
    [`${pickupAddressMessageRoute}.country`]: {
      id: `${pickupAddressMessageRoute}.country`,
      defaultMessage: 'Country'
    },
    [`${pickupAddressMessageRoute}.locality`]: {
      id: `${pickupAddressMessageRoute}.locality`,
      defaultMessage: 'City'
    },
    [`${pickupAddressMessageRoute}.address`]: {
      id: `${pickupAddressMessageRoute}.address`,
      defaultMessage: 'Address'
    },
    [`${pickupAddressMessageRoute}.state`]: {
      id: `${pickupAddressMessageRoute}.state`,
      defaultMessage: 'State'
    },
    [`${pickupAddressMessageRoute}.zip`]: {
      id: `${pickupAddressMessageRoute}.zip`,
      defaultMessage: 'ZIP Code'
    }
  })

  return (
    <section
      className={`${handles.commonPickupContainer} flex-ns flex-wrap flex-auto flex-column pt4 pb4`}
    >
      <h3>
        <FormattedMessage {...messages[`${pickupAddressMessageRoute}.title`]} />
      </h3>
      <div className="mb5">
        <p className="ma0">
          <FormattedMessage {...messages[`${pickupAddressMessageRoute}.pickup-type`]} />:{' '}
          {addressType === 'PICKUP_POINT' ? (
            <FormattedMessage
              {...messages[`${pickupAddressMessageRoute}.pickup-type.pickup-point`]}
            />
          ) : (
            <FormattedMessage
              {...messages[`${pickupAddressMessageRoute}.pickup-type.customer-address`]}
            />
          )}
        </p>
      </div>
      <div className="mb5">
        <p className="ma0">
          <FormattedMessage
            {...messages[`${pickupAddressMessageRoute}.country`]}
            values={{
              country,
            }}
          />
        </p>
      </div>
      <div className="mb5">
        <p className="ma0">
          <FormattedMessage
            {...messages[`${pickupAddressMessageRoute}.locality`]}
            values={{
              city,
            }}
          />
        </p>
      </div>
      <div className="mb5">
        <p className="ma0">
          <FormattedMessage
            {...messages[`${pickupAddressMessageRoute}.address`]}
            values={{
              address,
            }}
          />
        </p>
      </div>
      <div className="mb5">
        <p className="ma0">
          <FormattedMessage
            {...messages[`${pickupAddressMessageRoute}.state`]}
            values={{
              state,
            }}
          />
        </p>
      </div>
      <div className="mb5">
        <p className="ma0">
          <FormattedMessage
            {...messages[`${pickupAddressMessageRoute}.zip`]}
            values={{
              zipCode,
            }}
          />
        </p>
      </div>
    </section>
  )
}
