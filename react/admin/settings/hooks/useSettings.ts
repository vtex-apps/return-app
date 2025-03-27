import { useContext } from 'react'

import { SettingsContext } from '../provider/SettingsProvider'

export const useSettings = () => useContext(SettingsContext)
