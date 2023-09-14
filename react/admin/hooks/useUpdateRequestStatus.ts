import { useContext } from 'react'

import { UpdateRequestStatusContext } from '../provider/UpdateRequestStatusProvider'

export const useUpdateRequestStatus = () =>
  useContext(UpdateRequestStatusContext)
