import React from 'react'

import { ReturnDetailsContainer } from './ReturnDetails/ReturnDetailsContainer'
import { AlertProvider } from './provider/AlertProvider'
import { ReturnDetailsProvider } from '../common/provider/ReturnDetailsProvider'
import { UpdateRequestStatusProvider } from './provider/UpdateRequestStatusProvider'

interface CustomRouteProps {
  params: {
    id: string
  }
}

export const AdminReturnDetails = ({ params }: CustomRouteProps) => {
  return (
    <AlertProvider>
      <ReturnDetailsProvider requestId={params.id}>
        <UpdateRequestStatusProvider>
          <ReturnDetailsContainer />
        </UpdateRequestStatusProvider>
      </ReturnDetailsProvider>
    </AlertProvider>
  )
}
