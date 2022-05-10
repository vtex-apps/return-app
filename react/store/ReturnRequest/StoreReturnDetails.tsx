import React from 'react'

import { useReturnRequestDetails } from '../../hooks/useReturnRequestDetails'

interface CustomRouteProps {
  params: {
    id: string
  }
}

export const StoreReturnDetails = (props: CustomRouteProps) => {
  const { returnDetailsData } = useReturnRequestDetails(props.params.id)

  // eslint-disable-next-line no-console
  console.log({ returnDetailsData })

  return (
    <div>
      <h2>ReturnDetails</h2>
      <code>{JSON.stringify(returnDetailsData, null, 2)}</code>
    </div>
  )
}
