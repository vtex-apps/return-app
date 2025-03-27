import { useContext } from 'react'

import { AlertContext } from '../provider/AlertProvider'

export const useAlert = () => useContext(AlertContext)
