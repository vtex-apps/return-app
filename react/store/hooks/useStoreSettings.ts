import { useContext } from 'react'

import { StoreSettingsContext } from '../provider/StoreSettingsProvider'

export const useStoreSettings = () => useContext(StoreSettingsContext)
