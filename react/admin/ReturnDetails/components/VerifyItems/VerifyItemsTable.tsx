import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Table } from 'vtex.styleguide'
import type { ReturnRequestItem } from '../../../../../typings/ReturnRequest'

import { verifyItemsTableSchema } from './verifyItemsTableSchema'
import type { RefundItemMap, UpdateItemsChange } from './VerifyItemsPage'
import { useReturnDetails } from '../../../../common/hooks/useReturnDetails'

interface Props {
  items: ReturnRequestItem[]
  refundItemsInput: RefundItemMap
  onItemChange: UpdateItemsChange
}

export const VerifyItemsTable = ({
  items,
  refundItemsInput,
  onItemChange,
}: Props) => {
  const { data } = useReturnDetails()

  if (!data) return null

  const { cultureInfoData } = data.returnRequestDetails

  return (
    <div>
      <h3>
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.title.items" />
      </h3>
      <Table
        fullWidth
        fixFirstColumn
        schema={verifyItemsTableSchema(
          refundItemsInput,
          onItemChange,
          cultureInfoData
        )}
        items={items}
      />
    </div>
  )
}
