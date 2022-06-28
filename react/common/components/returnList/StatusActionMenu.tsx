import React from 'react'
import { FormattedMessage } from 'react-intl'
import type { Status } from 'vtex.return-app'
import { ActionMenu } from 'vtex.styleguide'

import type { FilterKeys } from './ListTableFilter'

interface Props {
  handleOnChange: (key: FilterKeys, value: string) => void
  status: Status | ''
  disabled: boolean
}

const requestsStatuses = {
  new: 'new',
  processing: 'processing',
  picked: 'pickedup-from-client',
  pendingVerification: 'pending-verification',
  verified: 'package-verified',
  denied: 'denied',
  refunded: 'refunded',
} as const

const StatusActionMenu = (props: Props) => {
  const { handleOnChange, status, disabled } = props

  const optionList = Object.keys(requestsStatuses).map((key) => {
    return {
      label: (
        <FormattedMessage
          id={`admin/return-app-status.${requestsStatuses[key]}`}
        />
      ),
      onClick: () => handleOnChange('status', key),
    }
  })

  const allStatusOption = {
    label: <FormattedMessage id="admin/return-app-status.allStatuses" />,
    onClick: () => handleOnChange('status', ''),
  }

  optionList.unshift(allStatusOption)

  return (
    <ActionMenu
      label={
        status || <FormattedMessage id="admin/return-app-status.allStatuses" />
      }
      align="right"
      buttonProps={{
        variation: 'secondary',
        size: 'small',
        disabled,
      }}
      options={optionList}
    />
  )
}

export { StatusActionMenu }
