import type { ChangeEvent } from 'react'
import React from 'react'
import { useIntl } from 'react-intl'
import type { ItemCondition } from '../../../../typings/ReturnRequest'
import { Dropdown } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import { defaultReturnConditionsMessages } from '../../../common/utils/defaultReturnConditionsMessages'

const CSS_HANDLES = ['conditionDropdwonContainer'] as const

interface Props {
  condition: string
  onConditionChange: (condition: ItemCondition) => void
  isExcluded: boolean
}

export const RenderConditionDropdown = ({
  condition,
  onConditionChange,
  isExcluded,
}: Props) => {
  const { formatMessage } = useIntl()
  const handles = useCssHandles(CSS_HANDLES)

  const handleConditionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    onConditionChange(value as ItemCondition)
  }

  const conditionOptions = [
    {
      value: 'newWithBox',
      label: formatMessage(defaultReturnConditionsMessages.newWithBox),
    },
    {
      value: 'newWithoutBox',
      label: formatMessage(defaultReturnConditionsMessages.newWithoutBox),
    },
    {
      value: 'usedWithBox',
      label: formatMessage(defaultReturnConditionsMessages.usedWithBox),
    },
    {
      value: 'usedWithoutBox',
      label: formatMessage(defaultReturnConditionsMessages.usedWithoutBox),
    },
  ]

  return (
    <div className={handles.conditionDropdwonContainer}>
      <Dropdown
        disabled={isExcluded}
        label=""
        placeholder={formatMessage(
          defaultReturnConditionsMessages.selectCondition
        )}
        size="small"
        options={conditionOptions}
        value={condition}
        onChange={handleConditionChange}
      />
    </div>
  )
}
