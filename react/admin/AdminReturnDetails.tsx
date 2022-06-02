import React from 'react'

import { ReturnDetailsContainer } from './ReturnDetails/ReturnDetailsContainer'
import { AlertProvider } from './provider/AlertProvider'

export interface CustomRouteProps {
  params: {
    id: string
  }
}

export const AdminReturnDetails = (props: CustomRouteProps) => {
  return (
    <AlertProvider>
      <ReturnDetailsContainer {...props} />
    </AlertProvider>
  )
}
