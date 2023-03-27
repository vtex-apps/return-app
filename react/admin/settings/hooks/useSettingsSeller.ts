import { useContext } from 'react'

import { SettingsDetailContextSeller } from '../provider/SettingsDetailProvider'

export const useSettingsDetail = () => useContext(SettingsDetailContextSeller)
