import React from 'react'

import { RMASettings } from './admin/settings/RMASettings'
import { SettingsProvider } from './admin/settings/provider/SettingsProvider'
import { AlertProvider } from './admin/provider/AlertProvider'

const RMASettingsWrapper = () => {
  return (
    <AlertProvider>
      <SettingsProvider>
        <RMASettings />
      </SettingsProvider>
    </AlertProvider>
  )
}

export default RMASettingsWrapper
