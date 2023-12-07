import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

import { useReturnDetails } from '../../../hooks/useReturnDetails'
import { ApprovedValues } from './ApprovedValues'
import { RequestedValues } from './RequestedValues'
import { AvailablesAmountsToRefund } from './AvailableAmounts'

const CSS_HANDLES = ['returnValuesContainer'] as const

export const ReturnValues = () => {
  const handles = useCssHandles(CSS_HANDLES)

  const { data } = useReturnDetails()

  if (!data) return null

  return (
    <section className={`${handles.returnValuesContainer} mv4`}>
      <AvailablesAmountsToRefund />
      <RequestedValues />
      <ApprovedValues />
    </section>
  )
}
