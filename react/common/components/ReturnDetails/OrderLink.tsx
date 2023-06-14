import React from 'react'
import { Link } from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'
import { FormattedMessage } from 'react-intl'

import { useReturnDetails } from '../../hooks/useReturnDetails'

export const OrderLink = () => {
  const { data } = useReturnDetails()
  const {
    route: { domain },
  } = useRuntime()

  if (!data) return null

  const isAdmin = domain === 'admin'
  const { orderId } = data.returnRequestDetails

  const targetHref = isAdmin
    ? `/admin/checkout/#/orders/${orderId}`
    : `/account/#/orders/${orderId}`

  return (
    <Link href={targetHref} target="_blank">
      <FormattedMessage
        id="store/return-app.return-request-details.order-id.link"
        values={{ orderId }}
      />
    </Link>
  )
}
