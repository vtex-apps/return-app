import { useContext } from 'react'

import { OrderToReturnContext } from '../provider/OrderToReturnProvider'

export const useReturnRequest = () => useContext(OrderToReturnContext)
