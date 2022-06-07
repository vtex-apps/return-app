import React from 'react'
import { Table, FloatingActionBar } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

const verifyItemsTableSchema = {
  properties: {
    item: {
      title: 'item',
    },
    unitPrice: {
      title: 'unitPrice',
    },
    unitTax: {
      title: 'unitTax',
    },
    totalUnit: {
      title: 'totalUnit',
    },
    quantity: {
      title: 'quantity',
    },
    restockFee: {
      title: 'restockFee',
    },
    totalRefund: {
      title: 'totalRefund',
    },
    status: {
      title: 'status',
    },
  },
}

interface Props {
  onViewVerifyItems: () => void
}

export const VerifyItemsPage = ({ onViewVerifyItems }: Props) => {
  return (
    <>
      <section>
        <h3>Verify Items</h3>
        <Table fullWidth schema={verifyItemsTableSchema} items={[]} />
      </section>
      <FloatingActionBar
        save={{
          label: (
            <FormattedMessage id="admin/return-app.return-request-details.verify-items.modal.confirm" />
          ),
          isLoading: false,
          onClick: () => {},
        }}
        cancel={{
          label: (
            <FormattedMessage id="admin/return-app.return-request-details.verify-items.modal.cancel" />
          ),
          onClick: onViewVerifyItems,
        }}
      />
    </>
  )
}
