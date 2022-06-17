import React from 'react'
import { useQuery } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import type { QueryNearestPickupPointsArgs } from 'vtex.return-app'
import { Tooltip, IconInfo, Toggle, Input } from 'vtex.styleguide'

import NEAREST_PICKUP_POINTS from '../graphql/nearestPickupPoints.gql'

interface Props {
  geoCoordinates: GeoCoordinates
}

export const AddressDetailsPickupPoints = ({ geoCoordinates }: Props) => {
  const [lat, long] = geoCoordinates.toString().split(',')

  const { data } = useQuery<{ items }, QueryNearestPickupPointsArgs>(
    NEAREST_PICKUP_POINTS,
    {
      variables: {
        lat,
        long,
      },
    }
  )

  // eslint-disable-next-line no-console
  console.log(data)

  return (
    <>
      <div className="flex items-center justify-between">
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
          <Toggle checked />
        </div>
      </div>
      <div className="mb4">
        <Input
          name="address"
          required
          placeholder="Address"
          //   onChange={handleInputChange}
          //   value={pickupReturnData.address}
        />
      </div>
      <div className="mb4">
        <Input
          name="city"
          required
          placeholder="City"
          //   onChange={handleInputChange}
          //   value={pickupReturnData.city}
        />
      </div>
      <div className="mb4">
        <Input
          name="state"
          requiered
          placeholder="State"
          //   onChange={handleInputChange}
          //   value={pickupReturnData.state}
        />
      </div>
      <div className="mb4">
        <Input
          name="zipCode"
          required
          placeholder="Zip Code"
          //   onChange={handleInputChange}
          //   value={pickupReturnData.zipCode}
        />
      </div>
      <div className="mb4">
        <Input
          name="country"
          required
          placeholder="Country"
          //   onChange={handleInputChange}
          //   value={pickupReturnData.country}
        />
      </div>
    </>
  )
}
