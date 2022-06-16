import React from 'react'

import { useReturnDetails } from '../../hooks/useReturnDetails'
import { createStatusTimeline } from '../../../utils/requestStatus'

export const StatusTimeline = () => {
  const { data } = useReturnDetails()

  if (!data) return null

  const { status, refundStatusData } = data.returnRequestDetails

  const timeline = createStatusTimeline(status, refundStatusData)

  // eslint-disable-next-line no-console
  console.log({ timeline })

  return <div>StatusTimeline</div>
}
