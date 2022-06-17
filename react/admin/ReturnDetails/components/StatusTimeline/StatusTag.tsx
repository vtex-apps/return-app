import React from 'react'
import type { Status } from 'vtex.return-app'
import { IconSuccess, IconClear } from 'vtex.styleguide'

interface Props {
  status: Status
  visited: boolean
}
export const StatusTag = ({ status, visited }: Props) => {
  return (
    <span className="flex items-center">
      {visited ? (
        <span className="flex status-icon">
          {status === 'denied' ? (
            <IconClear size={30} color="#f21515" />
          ) : (
            <IconSuccess size={30} color="#134cd8" />
          )}
        </span>
      ) : (
        <span className="status-icon-not-visited" />
      )}
      <p>{status}</p>
    </span>
  )
}
