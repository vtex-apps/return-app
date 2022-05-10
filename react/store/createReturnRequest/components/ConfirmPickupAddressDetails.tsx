import React from 'react'
import { FormattedMessage } from 'react-intl'
import type { PickupReturnDataInput } from 'vtex.return-app'

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

interface Props {
  pickupReturnData: PartialBy<PickupReturnDataInput, 'addressType'>
}

export const ConfirmPickupAddressDetails = ({ pickupReturnData }: Props) => {
  return (
    <div className="w-40">
      <h2 className="mt0 mb6">
        <FormattedMessage id="store/return-app.confirm-and-submit.pickup-address.title" />
      </h2>
      <p className="f6 gray">{pickupReturnData.address}</p>
      <p className="f6 gray">{pickupReturnData.city}</p>
      <p className="f6 gray">{pickupReturnData.state}</p>
      <p className="f6 gray">{pickupReturnData.zipCode}</p>
      <p className="f6 gray">{pickupReturnData.country}</p>
    </div>
  )
}
