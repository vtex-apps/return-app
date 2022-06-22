import React, { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useQuery } from 'react-apollo'
import type {
  QueryNearestPickupPointsArgs,
  NearPickupPointQueryResponse,
  PickupPoint,
  CheckoutAddress,
} from 'vtex.return-app'
import { Input, Dropdown } from 'vtex.styleguide'

import NEAREST_PICKUP_POINTS from '../graphql/nearestPickupPoints.gql'
import { useReturnRequest } from '../../hooks/useReturnRequest'

interface Props {
  geoCoordinates: GeoCoordinates
}

interface PickupPointsDropdownOptions {
  value: string
  label: string
}

export const AddressDetailsPickupPoints = ({ geoCoordinates }: Props) => {
  const [lat, long] = geoCoordinates.toString().split(',')

  const {
    actions: { updateReturnRequest },
  } = useReturnRequest()

  const [pickupPointsDropdownOptions, setPickupPointsDropdownOptions] =
    useState<PickupPointsDropdownOptions[]>([])

  const [selectedPickupPoint, setSelectedPickupPoint] = useState('')

  const [selectedPickupPointAddress, setSelectedPickupPointAddress] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  })

  const { data } = useQuery<
    {
      nearestPickupPoints: NearPickupPointQueryResponse
    },
    QueryNearestPickupPointsArgs
  >(NEAREST_PICKUP_POINTS, {
    variables: {
      lat,
      long,
    },
  })

  useEffect(() => {
    if (data?.nearestPickupPoints.items) {
      const dropdownOptions = data.nearestPickupPoints?.items.map((item) => {
        const { friendlyName, address } = item?.pickupPoint as PickupPoint
        const { street, number, postalCode } = address as CheckoutAddress

        return {
          value: friendlyName ?? '',
          label: `${friendlyName ?? ''} ${street ?? ''} ${number ?? ''} ${
            postalCode ?? ''
          }`,
        }
      })

      setPickupPointsDropdownOptions(dropdownOptions)
    }
  }, [data])

  const handlePickupPointSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const pickupPointName = e.currentTarget.value

    setSelectedPickupPoint(pickupPointName)

    const findSelectedPickupPoint = data?.nearestPickupPoints.items.find(
      (item) => {
        return item?.pickupPoint?.friendlyName === pickupPointName
      }
    )

    const { address } = findSelectedPickupPoint?.pickupPoint as PickupPoint
    const { street, number, city, country, state, postalCode, addressId } =
      address as CheckoutAddress

    const pickupPointReturnData = {
      address: `${street ?? ''} ${number ?? ''}`,
      city: city ?? '',
      state: state ?? '',
      zipCode: postalCode ?? '',
      country: country ?? '',
    }

    if (address) {
      setSelectedPickupPointAddress({
        ...pickupPointReturnData,
      })
    }

    updateReturnRequest({
      type: 'updatePickupReturnData',
      payload: {
        ...pickupPointReturnData,
        addressId,
        addressType: 'PICKUP_POINT',
      },
    })
  }

  return (
    <>
      <div className="mb4">
        <Dropdown
          label=""
          placeholder="Select Pickup Point"
          size="small"
          options={pickupPointsDropdownOptions}
          value={selectedPickupPoint}
          onChange={handlePickupPointSelected}
        />
      </div>
      <div className="mb4">
        <Input
          name="address"
          required
          placeholder="Address"
          //   onChange={handleInputChange}
          value={selectedPickupPointAddress.address}
        />
      </div>
      <div className="mb4">
        <Input
          name="city"
          required
          placeholder="City"
          //   onChange={handleInputChange}
          value={selectedPickupPointAddress.city}
        />
      </div>
      <div className="mb4">
        <Input
          name="state"
          requiered
          placeholder="State"
          //   onChange={handleInputChange}
          value={selectedPickupPointAddress.state}
        />
      </div>
      <div className="mb4">
        <Input
          name="zipCode"
          required
          placeholder="Zip Code"
          //   onChange={handleInputChange}
          value={selectedPickupPointAddress.zipCode}
        />
      </div>
      <div className="mb4">
        <Input
          name="country"
          required
          placeholder="Country"
          //   onChange={handleInputChange}
          value={selectedPickupPointAddress.country}
        />
      </div>
    </>
  )
}
