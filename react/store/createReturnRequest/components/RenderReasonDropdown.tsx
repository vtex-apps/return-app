import type { ChangeEvent } from 'react'
import React, { useState } from 'react'
import { useIntl, defineMessages } from 'react-intl'
import { Dropdown, Textarea } from 'vtex.styleguide'

import { useStoreSettings } from '../../hooks/useStoreSettings'
import { useReturnRequest } from '../../hooks/useReturnRequest'

const messages = defineMessages({
  reasonAccidentalOrder: {
    id: 'store/return-app.return-order-details.dropdown-reasons.accidental-order',
  },
  reasonBetterPrice: {
    id: 'store/return-app.return-order-details.dropdown-reasons.better-price',
  },
  reasonPerformance: {
    id: 'store/return-app.return-order-details.dropdown-reasons.performance',
  },
  reasonIncompatible: {
    id: 'store/return-app.return-order-details.dropdown-reasons.incompatible',
  },
  reasonItemDamaged: {
    id: 'store/return-app.return-order-details.dropdown-reasons.item-damaged',
  },
  reasonMissedDelivery: {
    id: 'store/return-app.return-order-details.dropdown-reasons.missed-delivery',
  },
  reasonMissingParts: {
    id: 'store/return-app.return-order-details.dropdown-reasons.missing-parts',
  },
  reasonBoxDamaged: {
    id: 'store/return-app.return-order-details.dropdown-reasons.box-damaged',
  },
  reasonDifferentProduct: {
    id: 'store/return-app.return-order-details.dropdown-reasons.different-product',
  },
  reasonDefective: {
    id: 'store/return-app.return-order-details.dropdown-reasons.defective',
  },
  reasonArrivedInAddition: {
    id: 'store/return-app.return-order-details.dropdown-reasons.arrived-in-addition',
  },
  reasonNoLongerNeeded: {
    id: 'store/return-app.return-order-details.dropdown-reasons.no-longer-needed',
  },
  reasonUnauthorizedPurchase: {
    id: 'store/return-app.return-order-details.dropdown-reasons.unauthorized-purchase',
  },
  reasonDifferentFromWebsite: {
    id: 'store/return-app.return-order-details.dropdown-reasons.different-from-website',
  },
  reasonOtherReason: {
    id: 'store/return-app.return-order-details.dropdown-reasons.other-reason',
  },
  reasonSelectReason: {
    id: 'store/return-app.return-order-details.dropdown-reasons.placeholder.select-reason',
  },
})

interface Props {
  reason: string
  otherReason: string
  onReasonChange: (reason: string, otherReason?: string) => void
  isExcluded: boolean
}

export const RenderReasonDropdown = ({
  reason,
  otherReason,
  onReasonChange,
  isExcluded,
}: Props) => {
  const { formatMessage } = useIntl()
  const [isOtherReason, setIsOtherReason] = useState(false)

  const { data: settings } = useStoreSettings()
  const { returnRequest } = useReturnRequest()

  // eslint-disable-next-line no-console
  console.log(returnRequest)

  const handleReasonChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const showTextarea = value === 'otherReason'

    setIsOtherReason(showTextarea)

    onReasonChange(value)
  }

  const handleOtherReasonChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    onReasonChange('otherReason', value)
  }

  const reasonOptions = [
    {
      value: 'reasonAccidentalOrder',
      label: formatMessage(messages.reasonAccidentalOrder),
    },
    {
      value: 'reasonBetterPrice',
      label: formatMessage(messages.reasonBetterPrice),
    },
    {
      value: 'reasonPerformance',
      label: formatMessage(messages.reasonPerformance),
    },
    {
      value: 'reasonIncompatible',
      label: formatMessage(messages.reasonIncompatible),
    },
    {
      value: 'reasonItemDamaged',
      label: formatMessage(messages.reasonItemDamaged),
    },
    {
      value: 'reasonMissedDelivery',
      label: formatMessage(messages.reasonMissedDelivery),
    },
    {
      value: 'reasonMissingParts',
      label: formatMessage(messages.reasonMissingParts),
    },
    {
      value: 'reasonBoxDamaged',
      label: formatMessage(messages.reasonBoxDamaged),
    },
    {
      value: 'reasonDifferentProduct',
      label: formatMessage(messages.reasonDifferentProduct),
    },
    {
      value: 'reasonDefective',
      label: formatMessage(messages.reasonDefective),
    },
    {
      value: 'reasonArrivedInAddition',
      label: formatMessage(messages.reasonArrivedInAddition),
    },
    {
      value: 'reasonNoLongerNeeded',
      label: formatMessage(messages.reasonNoLongerNeeded),
    },
    {
      value: 'reasonUnauthorizedPurchase',
      label: formatMessage(messages.reasonUnauthorizedPurchase),
    },
    {
      value: 'reasonDifferentFromWebsite',
      label: formatMessage(messages.reasonDifferentFromWebsite),
    },
  ]

  if (settings?.options?.enableOtherOptionSelection) {
    reasonOptions.push({
      value: 'otherReason',
      label: formatMessage(messages.reasonOtherReason),
    })
  }

  return (
    <>
      <Dropdown
        disabled={isExcluded}
        placeholder={formatMessage(messages.reasonSelectReason)}
        size="small"
        options={reasonOptions}
        value={reason}
        onChange={handleReasonChange}
      />
      {isOtherReason ? (
        <div className="mv3">
          <Textarea
            resize="none"
            value={otherReason}
            onChange={handleOtherReasonChange}
          />
        </div>
      ) : null}
    </>
  )
}
