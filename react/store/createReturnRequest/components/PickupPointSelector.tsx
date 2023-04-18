import React, { useState, useRef } from 'react'
import type { ChangeEvent } from 'react'
import { useQuery } from 'react-apollo'
import type {
  QueryNearestPickupPointsArgs,
  NearPickupPointQueryResponse,
  PickupPoint,
} from '../../../../typings/PickupPoints'
import { useCssHandles } from 'vtex.css-handles'
import { Dropdown, Spinner } from 'vtex.styleguide'
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

const CSS_HANDLES = ['pickupPointContainer'] as const

export const PickupPointSelector = ({ geoCoordinates }: Props) => {
  const [lat, long] = geoCoordinates.toString().split(',')
  const handles = useCssHandles(CSS_HANDLES)

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
    <div className={`${handles.pickupPointContainer} mb4`}>
      {loading ? (
        <div className="h2">
          <Spinner />
        </div>
      ) : (
        <FormattedMessage id="return-app.return-order-details.pickup-address.drop-off-points.dropdown.placehoder" >
          {(placehoder) => (
            <Dropdown
              label=""
              error={Boolean(error)}
              errorMessage={
                error ? (
                  <FormattedMessage id="return-app.return-order-details.pickup-address.drop-off-points.dropdown.error" />
                ) : undefined
              }
              placeholder={placehoder}
              options={pickupPointsDropdownOptions}
              value={pickupReturnData.addressId}
              onChange={handlePickupPointSelected}
              preventTruncate
            />
          )}
        </FormattedMessage>
      )}
    </div>
  )
}
