import type { ReactElement } from 'react'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { useReturnDetails } from '../../hooks/useReturnDetails'
import { renderStatus } from '../RenderStatus'

const CSS_HANDLES = ['currentRequestStatusContainer'] as const
const renderChunks = (chunks: ReactElement) => <b>{chunks}</b>

export const CurrentRequestStatus = () => {
  const handles = useCssHandles(CSS_HANDLES)

  const { data } = useReturnDetails()

  if (!data) return null

  const { id, status } = data.returnRequestDetails

  return (
    <div className={`${handles.currentRequestStatusContainer} mv4`}>
      <div className="mb4">
        <FormattedMessage
          id="store/return-app.return-request-details.current-status.request-id"
          values={{ id, b: renderChunks }}
        />
      </div>
      <div className="flex">
        <span className="mr2">
          <FormattedMessage
            id="store/return-app.return-request-details.current-status.status"
            values={{
              b: renderChunks,
            }}
          />
        </span>
        {renderStatus(status)}
      </div>
    </div>
  )
}
