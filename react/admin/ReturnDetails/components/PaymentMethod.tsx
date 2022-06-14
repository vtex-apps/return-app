import React from 'react'
// import { FormattedMessage } from 'react-intl'

import { useReturnDetails } from '../../hooks/useReturnDetails'

export const PaymentMethod = () => {
  const { data } = useReturnDetails()

  if (!data) return null

  return <h2>Refund Payment Data</h2>
}
