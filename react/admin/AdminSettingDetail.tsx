import React from 'react'

import { AlertProvider } from './provider/AlertProvider'
import { SettingsDetailProvider } from './settings/provider/SettingsDetailProvider'
import { SettingDetailsContainer } from './settings/SettingDetails/SettingDetailsContainer'

interface CustomRouteProps {
  params: {
    id: string
  }
}

export const AdminSettingDetail = ({ params }: CustomRouteProps) => {
  return (
    <AlertProvider>
    <SettingsDetailProvider sellerId={params.id}>
      <SettingDetailsContainer />
    </SettingsDetailProvider>
  </AlertProvider>
  )
}
