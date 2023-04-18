import React from 'react'
import type { Status } from '../../../../../typings/ReturnRequest'
import { IconSuccess, IconClear } from 'vtex.styleguide'
import { useIntl } from 'react-intl'

import { timelineStatusMessageId } from '../../../../utils/requestStatus'

interface Props {
  status: Status
  visited: boolean
  createdAt?: string
}
export const StatusTag = ({ status, visited, createdAt }: Props) => {
  const { formatMessage } = useIntl()

  const invalid = ['denied', 'cancelled'].includes(status)

  return (
    <span className="flex items-center">
      {visited ? (
        <span className="flex status-icon">
          {invalid ? (
            <IconClear size={30} color="#f21515" />
          ) : (
            <IconSuccess size={30} color="#134cd8" />
          )}
        </span>
      ) : (
        <span className="status-icon-not-visited" />
      )}
      <p>
        {formatMessage(
          timelineStatusMessageId[status],
          createdAt
            ? {
                ts: new Date(createdAt),
              }
            : {}
        )}
      </p>
    </span>
  )
}
