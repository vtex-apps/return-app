import React from 'react'
import type { RouteComponentProps } from 'react-router'

import { useReturnRequestDetails } from '../../hooks/useReturnRequestDetails'

export const StoreReturnDetails = (
  props: RouteComponentProps<{ id: string }>
) => {
  const { returnDetailsData } = useReturnRequestDetails(props.match.params.id)

  // eslint-disable-next-line no-console
  console.log({ returnDetailsData })

  return (
    <div>
      <h2>ReturnDetails</h2>
      <code>{JSON.stringify(returnDetailsData, null, 2)}</code>
    </div>
  )
}
