import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import type { Status } from 'vtex.return-app'
import { ActionMenu } from 'vtex.styleguide'

import type { FilterKeys } from './ListTableFilter'

interface Props {
  handleOnChange: (key: FilterKeys, value: string) => void
  status: Status | ''
  disabled: boolean
}

const keyedStatusMessages = defineMessages({
  new: {
    id: 'return-app.return-request-list.table.status.new',
  },
  processing: {
    id: 'return-app.return-request-list.table.status.processing',
  },
  picked: {
    id: 'return-app.return-request-list.table.status.pickedup-from-client',
  },
  pendingVerification: {
    id: 'return-app.return-request-list.table.status.pending-verification',
  },
  verified: {
    id: 'return-app.return-request-list.table.status.package-verified',
  },
  denied: {
    id: 'return-app.return-request-list.table.status.denied',
  },
  refunded: {
    id: 'return-app.return-request-list.table.status.refunded',
  },
})

const StatusActionMenu = (props: Props) => {
  const { handleOnChange, status, disabled } = props

  const { formatMessage } = useIntl()

  const optionList = Object.keys(keyedStatusMessages).map((key) => {
    return {
      label: formatMessage({ id: keyedStatusMessages[key].id }),
      onClick: () => handleOnChange('status', key),
    }
  })

  const allStatusOption = {
    label: formatMessage({
      id: 'return-app.return-request-list.table.status.allStatus',
    }),
    onClick: () => handleOnChange('status', ''),
  }

  optionList.unshift(allStatusOption)

  return (
    <ActionMenu
      label={
        status ||
        formatMessage({
          id: 'return-app.return-request-list.table.status.allStatus',
        })
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
