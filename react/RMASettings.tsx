import React from 'react'

import { RMASettings } from './admin/settings/RMASettings'
import { SettingsProvider } from './admin/settings/provider/SettingsProvider'

const RMASettingsWrapper = () => {
  return (
    <SettingsProvider>
      <RMASettings />
    </SettingsProvider>
  )
}

export default RMASettingsWrapper
