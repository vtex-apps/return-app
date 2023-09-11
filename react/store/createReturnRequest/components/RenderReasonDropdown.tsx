import type { ChangeEvent } from 'react'
import React from 'react'
import { useIntl } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import { Dropdown, Textarea } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import { getReasonOptions } from '../../../common/constants/returnsRequest'
import { useStoreSettings } from '../../hooks/useStoreSettings'
import { defaultReturnReasonsMessages } from '../../utils/defaultReturnReasonsMessages'
import { generateCustomReasonOptions } from '../../utils/generateCustomReasonOptions'

const CSS_HANDLES = ['otherReasonOptionContainer'] as const

interface Props {
  reason: string
  otherReason: string
  onReasonChange: (reason: string, otherReason?: string) => void
  isExcluded: boolean
  creationDate?: string
  isAdmin: boolean
}

export const RenderReasonDropdown = (props: Props) => {
  const { reason, otherReason, onReasonChange, isExcluded, creationDate } =
    props

  const { formatMessage } = useIntl()
  const handles = useCssHandles(CSS_HANDLES)

  const { data: settings } = useStoreSettings()
  const {
    culture: { locale },
  } = useRuntime()

  const customReturnReasons = settings?.customReturnReasons

  const handleReasonChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    onReasonChange(value)
  }

  const handleOtherReasonChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    onReasonChange('otherReason', value)
  }

  let reasonOptions: Array<{ value: string; label: string }>

  if (customReturnReasons && customReturnReasons.length > 0 && creationDate) {
    reasonOptions = generateCustomReasonOptions(
      customReturnReasons,
      locale,
      creationDate
    )
  } else {
    reasonOptions = getReasonOptions(formatMessage)
  }

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
        <div className={`${handles.otherReasonOptionContainer} mv3`}>
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
