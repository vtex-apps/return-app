import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Table } from 'vtex.styleguide'

import { verifyTotalsTableSchema } from './verifyTotalsTableSchema'
import type { UpdateRefundShipping } from './VerifyItemsPage'
import { useReturnDetails } from '../../../../common/hooks/useReturnDetails'

interface Props {
  refundableShipping: number
  shippingToRefund: number
  totalRefundItems: number
  onRefundShippingChange: UpdateRefundShipping
}

export const VerifyTotalsTable = ({
  refundableShipping,
  shippingToRefund,
  totalRefundItems,
  onRefundShippingChange,
}: Props) => {
  const { data } = useReturnDetails()

  if (!data) return null

  const { cultureInfoData } = data.returnRequestDetails

  return (
    <div>
      <h3>
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.title.totals" />
      </h3>
      <Table
        fullWidth
        schema={verifyTotalsTableSchema(
          onRefundShippingChange,
          cultureInfoData
        )}
        items={[
          {
            refundableShipping,
            shippingToRefund,
            totalRefundItems,
            totalRefund: shippingToRefund + totalRefundItems,
          },
        ]}
      />
    </div>
  )
}
