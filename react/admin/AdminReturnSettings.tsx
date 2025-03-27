import React from 'react'

import { RMASettings } from './settings/RMASettings'
import { SettingsProvider } from './settings/provider/SettingsProvider'
import { AlertProvider } from './provider/AlertProvider'

export const RMASettingsWrapper = () => {
  return (
    <AlertProvider>
      <SettingsProvider>
        <RMASettings />
      </SettingsProvider>
    </AlertProvider>
  )
}
