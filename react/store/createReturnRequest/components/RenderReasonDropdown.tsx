import type { ChangeEvent } from 'react'
import React from 'react'
import { useIntl } from 'react-intl'
import { Dropdown, Textarea } from 'vtex.styleguide'

import { useStoreSettings } from '../../hooks/useStoreSettings'
import { defaultReturnReasonsMessages } from '../../utils/defaultReturnReasonsMessages'

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

  const { data: settings } = useStoreSettings()

  const handleReasonChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    onReasonChange(value)
  }

  const handleOtherReasonChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    onReasonChange('otherReason', value)
  }

  const reasonOptions = [
    {
      value: 'reasonAccidentalOrder',
      label: formatMessage(defaultReturnReasonsMessages.reasonAccidentalOrder),
    },
    {
      value: 'reasonBetterPrice',
      label: formatMessage(defaultReturnReasonsMessages.reasonBetterPrice),
    },
    {
      value: 'reasonPerformance',
      label: formatMessage(defaultReturnReasonsMessages.reasonPerformance),
    },
    {
      value: 'reasonIncompatible',
      label: formatMessage(defaultReturnReasonsMessages.reasonIncompatible),
    },
    {
      value: 'reasonItemDamaged',
      label: formatMessage(defaultReturnReasonsMessages.reasonItemDamaged),
    },
    {
      value: 'reasonMissedDelivery',
      label: formatMessage(defaultReturnReasonsMessages.reasonMissedDelivery),
    },
    {
      value: 'reasonMissingParts',
      label: formatMessage(defaultReturnReasonsMessages.reasonMissingParts),
    },
    {
      value: 'reasonBoxDamaged',
      label: formatMessage(defaultReturnReasonsMessages.reasonBoxDamaged),
    },
    {
      value: 'reasonDifferentProduct',
      label: formatMessage(defaultReturnReasonsMessages.reasonDifferentProduct),
    },
    {
      value: 'reasonDefective',
      label: formatMessage(defaultReturnReasonsMessages.reasonDefective),
    },
    {
      value: 'reasonArrivedInAddition',
      label: formatMessage(
        defaultReturnReasonsMessages.reasonArrivedInAddition
      ),
    },
    {
      value: 'reasonNoLongerNeeded',
      label: formatMessage(defaultReturnReasonsMessages.reasonNoLongerNeeded),
    },
    {
      value: 'reasonUnauthorizedPurchase',
      label: formatMessage(
        defaultReturnReasonsMessages.reasonUnauthorizedPurchase
      ),
    },
    {
      value: 'reasonDifferentFromWebsite',
      label: formatMessage(
        defaultReturnReasonsMessages.reasonDifferentFromWebsite
      ),
    },
  ]

  if (settings?.options?.enableOtherOptionSelection) {
    reasonOptions.push({
      value: 'otherReason',
      label: formatMessage(defaultReturnReasonsMessages.reasonOtherReason),
    })
  }

  return (
    <>
      <Dropdown
        disabled={isExcluded}
        placeholder={formatMessage(
          defaultReturnReasonsMessages.reasonSelectReason
        )}
        size="small"
        options={reasonOptions}
        value={reason}
        onChange={handleReasonChange}
      />
      {reason === 'otherReason' ? (
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
