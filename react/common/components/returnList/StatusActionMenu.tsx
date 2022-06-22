import React from 'react'
import { FormattedMessage } from 'react-intl'
import type { Status } from 'vtex.return-app'
import { ActionMenu } from 'vtex.styleguide'

import type { FilterKeys } from './ListTableFilter'

interface Props {
  handleOnChange: (key: FilterKeys, value: string) => void
  status: Status | ''
}

const requestsStatuses = {
  new: 'new',
  processing: 'processing',
  picked: 'pickedUpFromClient',
  pendingVerification: 'pendingVerification',
  verified: 'packageVerified',
  denied: 'denied',
  refunded: 'amountRefunded',
} as const

/**
 * @todo
 * - Resolve messages
 * - Resolve STATUS variable
 */
const StatusActionMenu = (props: Props) => {
  const { handleOnChange, status } = props

  const optionList = Object.keys(requestsStatuses).map((key) => {
    return {
      label: requestsStatuses[key],
      onClick: () => handleOnChange('status', requestsStatuses[key]),
    }
  })

  const allStatusOption = {
    label: <FormattedMessage id="returns.statusAllStatuses" />,
    onClick: () => handleOnChange('status', ''),
  }

  optionList.unshift(allStatusOption)

  return (
    <ActionMenu
      label={status || 'ALL'}
      align="right"
      buttonProps={{
        variation: 'secondary',
        size: 'small',
      }}
      options={optionList}
    />
  )
}

export { StatusActionMenu }
