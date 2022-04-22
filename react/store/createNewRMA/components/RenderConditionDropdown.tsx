import React from 'react'
import { useIntl, defineMessages } from 'react-intl'
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

export const RenderConditionDropdown = ({ condition, handleCondition, id }) => {
  const { formatMessage } = useIntl()
  const conditionOptions = [
    {
      value: 'New With Box',
      label: formatMessage(messages.conditionNewWithBox),
    },
    {
      value: 'New Without Box',
      label: formatMessage(messages.conditionNewWithoutBox),
    },
    {
      value: 'Used With Box',
      label: formatMessage(messages.conditionUsedWithBox),
    },
    {
      value: 'Used Without Box',
      label: formatMessage(messages.conditionUsedWithoutBox),
    },
  ]

  return (
    <div>
      <Dropdown
        label=""
        placeholder={formatMessage(messages.conditionSelectCondition)}
        size="small"
        options={conditionOptions}
        value={condition[id]}
        onChange={(e) => {
          handleCondition(id, e.target.value)
        }}
      />
    </div>
  )
}
