import type { ChangeEvent } from 'react'
import React from 'react'
import { useIntl, defineMessages } from 'react-intl'
import type { ItemCondition } from 'vtex.return-app'
import { Dropdown } from 'vtex.styleguide'

const messages = defineMessages({
  conditionNewWithBox: {
    id: 'store/return-app.return-order-details.dropdown-conditions.new-with-box',
  },
  conditionNewWithoutBox: {
    id: 'store/return-app.return-order-details.dropdown-conditions.new-without-box',
  },
  conditionUsedWithBox: {
    id: 'store/return-app.return-order-details.dropdown-conditions.used-with-box',
  },
  conditionUsedWithoutBox: {
    id: 'store/return-app.return-order-details.dropdown-conditions.used-without-box',
  },
  conditionSelectCondition: {
    id: 'store/return-app.return-order-details.dropdown-conditions.placeholder.select-condition',
  },
})

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

  const handleConditionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    onConditionChange(value as ItemCondition)
  }

  const conditionOptions = [
    {
      value: 'newWithBox',
      label: formatMessage(messages.conditionNewWithBox),
    },
    {
      value: 'newWithoutBox',
      label: formatMessage(messages.conditionNewWithoutBox),
    },
    {
      value: 'usedWithBox',
      label: formatMessage(messages.conditionUsedWithBox),
    },
    {
      value: 'usedWithoutBox',
      label: formatMessage(messages.conditionUsedWithoutBox),
    },
  ]

  return (
    <div>
      <Dropdown
        disabled={isExcluded}
        label=""
        placeholder={formatMessage(messages.conditionSelectCondition)}
        size="small"
        options={conditionOptions}
        value={condition}
        onChange={handleConditionChange}
      />
    </div>
  )
}
