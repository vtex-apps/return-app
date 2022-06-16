import React from 'react'

import { useReturnDetails } from '../../../hooks/useReturnDetails'
import { ApprovedValues } from './ApprovedValues'
import { RequestedValues } from './RequestedValues'

export const ReturnValues = () => {
  const { data } = useReturnDetails()

  if (!data) return null

  return (
    <section className="mv4">
      <RequestedValues />
      <ApprovedValues />
    </section>
  )
}
