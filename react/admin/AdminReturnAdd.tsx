import React from 'react'
import type { RouteComponentProps } from 'react-router'

import { AlertProvider } from './provider/AlertProvider'
// import { ReturnAddContainer } from './ReturnAdd/ReturnAddContainer'
import { StoreSettingsPovider } from '../store/provider/StoreSettingsProvider'
import { OrderToReturnProvider } from '../store/provider/OrderToReturnProvider'
import { CreateReturnRequest } from '../store/createReturnRequest/CreateReturnRequest'

type RouteProps = RouteComponentProps<{ orderId: string }>

export const AdminReturnAdd = (props: RouteProps) => {
  return (
    <AlertProvider>
      {/* <ReturnAddContainer> */}
        <StoreSettingsPovider>
          <OrderToReturnProvider>
            <CreateReturnRequest {...props} />
          </OrderToReturnProvider>
        </StoreSettingsPovider>
      {/* </ReturnAddContainer> */}
    </AlertProvider>
  )
}
