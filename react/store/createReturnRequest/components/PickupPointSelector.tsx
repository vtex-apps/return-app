import React, { useState, useRef } from 'react'
import type { ChangeEvent } from 'react'
import { useQuery } from 'react-apollo'
import type {
  QueryNearestPickupPointsArgs,
  NearPickupPointQueryResponse,
  PickupPoint,
} from 'vtex.return-app'
import { Dropdown } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import NEAREST_PICKUP_POINTS from '../graphql/nearestPickupPoints.gql'
import { useReturnRequest } from '../../hooks/useReturnRequest'

interface Props {
  geoCoordinates: GeoCoordinates
}

interface PickupPointsDropdownOptions {
  value: string
  label: string
}

export const PickupPointSelector = ({ geoCoordinates }: Props) => {
  const [lat, long] = geoCoordinates.toString().split(',')

  const {
    returnRequest: { pickupReturnData },
    actions: { updateReturnRequest },
  } = useReturnRequest()

  const [pickupPointsDropdownOptions, setPickupPointsDropdownOptions] =
    useState<PickupPointsDropdownOptions[]>([])

  const pickupPointsRef = useRef<Map<string, PickupPoint> | null>(null)

  const { loading, error } = useQuery<
    {
      nearestPickupPoints: NearPickupPointQueryResponse
    },
    QueryNearestPickupPointsArgs
  >(NEAREST_PICKUP_POINTS, {
    variables: {
      lat,
      long,
    },
    onCompleted: (dataOnComplete) => {
      const { nearestPickupPoints } = dataOnComplete
      const dropdownOptions = nearestPickupPoints.items.map((item) => {
        const { friendlyName, address } = item.pickupPoint
        const { street, number, postalCode, addressId } = address

        return {
          value: addressId ?? '',
          label: `${friendlyName ?? ''} ${street ?? ''} ${number ?? ''} ${
            postalCode ?? ''
          }`,
        }
      })

      const pickupPointsMap = new Map<string, PickupPoint>()

      for (const { pickupPoint } of nearestPickupPoints.items) {
        const {
          address: { addressId },
        } = pickupPoint

        pickupPointsMap.set(addressId, pickupPoint)
      }

      setPickupPointsDropdownOptions(dropdownOptions)
      pickupPointsRef.current = pickupPointsMap
    },
  })

  const handlePickupPointSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const pickupPointId = e.currentTarget.value

    const pickupPoint = pickupPointsRef.current?.get(pickupPointId)

    if (loading || !pickupPoint) return

    const { address } = pickupPoint
    const { street, number, city, country, state, postalCode, addressId } =
      address

    const pickupPointReturnData = {
      address: `${street ?? ''} ${number ?? ''}`,
      city: city ?? '',
      state: state ?? '',
      zipCode: postalCode ?? '',
      country: country ?? '',
      addressId,
    }

    updateReturnRequest({
      type: 'updatePickupReturnData',
      payload: {
        ...pickupPointReturnData,
        addressType: 'PICKUP_POINT',
      },
    })
  }

  return (
    <div className="mb4">
      <Dropdown
        label=""
        error={Boolean(error)}
        errorMessage={
          !error ? (
            <FormattedMessage id="store/return-app.return-order-details.pickup-address.drop-off-points.dropdown.error" />
          ) : undefined
        }
        placeholder={
          <FormattedMessage id="store/return-app.return-order-details.pickup-address.drop-off-points.dropdown.placehoder" />
        }
        size="small"
        options={pickupPointsDropdownOptions}
        value={pickupReturnData.addressId}
        onChange={handlePickupPointSelected}
        preventTruncate
      />
    </div>
  )
}
