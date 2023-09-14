import { useContext } from 'react'

import { ReturnDetailsContext } from '../provider/ReturnDetailsProvider'

export const useReturnDetails = () => useContext(ReturnDetailsContext)
