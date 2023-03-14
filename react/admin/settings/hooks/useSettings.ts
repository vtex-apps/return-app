import { useContext } from 'react'

import { SettingsContext } from '../provider/SettingsProvider'
import { SettingsDetailContext } from '../provider/SettingsDetailProvider'

export const useSettings = () => useContext(SettingsContext)

export const useSettingsDetail = () => useContext(SettingsDetailContext)
