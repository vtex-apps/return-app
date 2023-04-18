import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import type { Status } from '../../../../typings/ReturnRequest'
import { ActionMenu } from 'vtex.styleguide'

import type { FilterKeys } from './ListTableFilter'

interface Props {
  handleOnChange: (key: FilterKeys, value: string) => void
  status: Status | ''
  disabled: boolean
}

const allStatusKey = 'allStatus'

const keyedStatusMessages = defineMessages({
  [allStatusKey]: {
    id: 'return-app.return-request-list.table.status.allStatus',
  },
  new: {
    id: 'return-app.return-request-list.table.status.new',
  },
  processing: {
    id: 'return-app.return-request-list.table.status.processing',
  },
  pickedUpFromClient: {
    id: 'return-app.return-request-list.table.status.pickedup-from-client',
  },
  pendingVerification: {
    id: 'return-app.return-request-list.table.status.pending-verification',
  },
  packageVerified: {
    id: 'return-app.return-request-list.table.status.package-verified',
  },
  denied: {
    id: 'return-app.return-request-list.table.status.denied',
  },
  cancelled: {
    id: 'return-app.return-request-list.table.status.cancelled',
  },
  amountRefunded: {
    id: 'return-app.return-request-list.table.status.refunded',
  },
})

const StatusActionMenu = (props: Props) => {
  const { handleOnChange, status, disabled } = props

  const { formatMessage } = useIntl()

  const optionList = Object.keys(keyedStatusMessages).map((key) => {
    const keyName = key === allStatusKey ? '' : key

    return {
      label: formatMessage({ id: keyedStatusMessages[key].id }),
      onClick: () => handleOnChange('status', keyName),
    }
  })

  return (
    <ActionMenu
      label={
        status
          ? formatMessage(keyedStatusMessages[status])
          : formatMessage(keyedStatusMessages[allStatusKey])
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
