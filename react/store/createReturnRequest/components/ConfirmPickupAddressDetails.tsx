import React from 'react'
import { FormattedMessage } from 'react-intl'
import type { PickupReturnDataInput } from 'vtex.return-app'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'

interface Props {
  pickupReturnData: PickupReturnDataInput
}

const CSS_HANDLES = [
  'confirmPickupContainer',
  'confirmPickupTitle',
  'confirmPickupText',
] as const

export const ConfirmPickupAddressDetails = ({ pickupReturnData }: Props) => {
  const handles = useCssHandles(CSS_HANDLES)
  const {
    hints: { phone },
  } = useRuntime()

  return (
    <div
      className={`${handles.confirmPickupContainer} ${
        phone ? 'w-100' : 'w-40'
      }`}
    >
      <h2 className={`${handles.confirmPickupTitle} mt0 mb6`}>
        <FormattedMessage id="return-app.confirm-and-submit.pickup-address.title" />
      </h2>
      <p className={`${handles.confirmPickupText}  f6 gray`}>
        {pickupReturnData.address}
      </p>
      <p className={`${handles.confirmPickupText}  f6 gray`}>
        {pickupReturnData.city}
      </p>
      <p className={`${handles.confirmPickupText}  f6 gray`}>
        {pickupReturnData.state}
      </p>
      <p className={`${handles.confirmPickupText} f6 gray`}>
        {pickupReturnData.zipCode}
      </p>
      <p className={`${handles.confirmPickupText}  f6 gray`}>
        {pickupReturnData.country}
      </p>
    </div>
  )
}
