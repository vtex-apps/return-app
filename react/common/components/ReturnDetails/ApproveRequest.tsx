import React from 'react'
import { Button } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'

import { useReturnDetails } from '../../hooks/useReturnDetails'
import { useUpdateRequestStatus } from '../../../admin/hooks/useUpdateRequestStatus'

const ApproveRequest = ({ onViewVerifyItems }) => {
  const { handleStatusUpdate } = useUpdateRequestStatus()
  const { data } = useReturnDetails()
  const {
    hints: { phone },
  } = useRuntime()

  if (!data) return null

  const { id, status } = data.returnRequestDetails

  const isDisabled = ['amountRefunded', 'denied', 'canceled'].includes(status)

  if (isDisabled) return null

  const handleRefund = async () => {
    handleStatusUpdate({
      id,
      status: 'amountRefunded',
    })
  }

  return (
    <>
      <div className={phone ? 'mt4' : ''}>
        <Button
          type="button"
          variation="primary"
          size="small"
          onClick={status === 'new' ? onViewVerifyItems : handleRefund}
        >
          {status === 'new' ? (
            <FormattedMessage id="admin/return-app.return-request-details.verify-items.button" />
          ) : (
            <FormattedMessage id="admin/return-app.return-request-details.refund-amount.button" />
          )}
        </Button>
      </div>
    </>
  )
}

export default ApproveRequest
