import React from 'react'

import { AlertProvider } from './provider/AlertProvider'
import { SettingsProvider } from './settings/provider/SettingsProvider'
import { SettingDetailsContainer } from './settings/SettingDetails/SettingDetailsContainer'

interface CustomRouteProps {
  params: {
    id: string
  }
}

export const AdminSettingDetail = ({ params }: CustomRouteProps) => {
  return (
    <AlertProvider>
      <SettingsProvider sellerId={params.id}>
        <SettingDetailsContainer />
      </SettingsProvider>
    </AlertProvider>
  )
}
