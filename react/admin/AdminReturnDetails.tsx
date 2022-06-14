import React from 'react'

import { ReturnDetailsContainer } from './ReturnDetails/ReturnDetailsContainer'
import { AlertProvider } from './provider/AlertProvider'
import { ReturnDetailsProvider } from './provider/ReturnDetailsProvider'

interface CustomRouteProps {
  params: {
    id: string
  }
}

export const AdminReturnDetails = ({ params }: CustomRouteProps) => {
  return (
    <AlertProvider>
      <ReturnDetailsProvider requestId={params.id}>
        <ReturnDetailsContainer />
      </ReturnDetailsProvider>
    </AlertProvider>
  )
}
