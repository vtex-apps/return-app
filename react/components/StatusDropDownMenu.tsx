import React from 'react'
import { FormattedMessage } from 'react-intl'
import { ActionMenu } from 'vtex.styleguide'

import type { initialFilters } from '../common/constants/returnsTable'
import { requestsStatuses, capitalize } from '../common/utils'

type FilterBy = keyof typeof initialFilters

type StatusDropDownMenuProps = {
  filterByKey: (filterBy: FilterBy, value: string) => void
  statusLabel: JSX.Element
}

const StatusDropDownMenu = ({
  statusLabel,
  filterByKey,
}: StatusDropDownMenuProps) => {
  /**
   * here we load requestsStatuses as an array and we use the keys as the values of the dropdown
   */
  const optionList = Object.keys(requestsStatuses).map((key) => {
    return {
      label: <FormattedMessage id={`returns.status${capitalize(key)}`} />,
      onClick: () => filterByKey('status', key),
    }
  })

  const allStatusOption = {
    label: <FormattedMessage id="returns.statusAllStatuses" />,
    onClick: () => filterByKey('status', ''),
  }

  optionList.unshift(allStatusOption)

  return (
    <ActionMenu
      label={statusLabel}
      align="right"
      buttonProps={{
        variation: 'secondary',
        size: 'small',
      }}
      options={optionList}
    />
  )
}

export { StatusDropDownMenu }
