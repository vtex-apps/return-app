import React from 'react'
import {
  Table,
  FloatingActionBar,
  InputCurrency,
  NumericStepper,
} from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import type { ReturnRequestItem } from 'vtex.return-app'
import { FormattedCurrency } from 'vtex.format-currency'

import { useReturnDetails } from '../../hooks/useReturnDetails'

const verifyItemsTableSchema = {
  properties: {
    name: {
      title: 'Product',
    },
    sellingPrice: {
      title: 'Price',
      // eslint-disable-next-line react/display-name
      cellRenderer: ({
        cellData,
      }: {
        rowData: ReturnRequestItem
        cellData: ReturnRequestItem['sellingPrice']
      }) => {
        // TODO: Refactor this with right currency symbol and locale
        return <FormattedCurrency value={cellData / 100} />
      },
    },
    tax: {
      title: 'unitTax',
      // eslint-disable-next-line react/display-name
      cellRenderer: ({
        cellData,
      }: {
        rowData: ReturnRequestItem
        cellData: ReturnRequestItem['tax']
      }) => {
        // TODO: Refactor this with right currency symbol and locale
        return <FormattedCurrency value={cellData / 100} />
      },
    },
    totalPrice: {
      title: 'Total',
      // eslint-disable-next-line react/display-name
      cellRenderer: ({ rowData }: { rowData: ReturnRequestItem }) => {
        const { sellingPrice, tax } = rowData

        // TODO: Refactor this with right currency symbol and locale
        return <FormattedCurrency value={(sellingPrice + tax) / 100} />
      },
    },
    quantity: {
      title: 'Quantity',
      // eslint-disable-next-line react/display-name
      cellRenderer: ({
        cellData,
      }: {
        rowData: ReturnRequestItem
        cellData: ReturnRequestItem['quantity']
      }) => {
        return cellData
      },
    },
    verified: {
      title: 'Verified',
      // eslint-disable-next-line react/display-name
      cellRenderer: ({ rowData }: { rowData: ReturnRequestItem }) => {
        const { quantity } = rowData

        return <NumericStepper maxValue={quantity} />
      },
    },
    restockFee: {
      title: 'Restock Fee',
      // eslint-disable-next-line react/display-name
      cellRenderer: ({ rowData }: { rowData: ReturnRequestItem }) => {
        const { sellingPrice, tax } = rowData

        // TODO: Refactor this with right currency symbol and locale
        return (
          <InputCurrency
            value={100}
            currencyCode="EUR"
            locale="es-ES"
            max={(sellingPrice + tax) / 100}
          />
        )
      },
    },
    totalRefund: {
      title: 'Total',
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
  const { submitting, data } = useReturnDetails()

  const { items = [] } = data?.returnRequestDetails ?? {}

  return (
    <>
      <section>
        <h2>
          <FormattedMessage id="admin/return-app.return-request-details.verify-items.title" />
        </h2>
        <Table fullWidth schema={verifyItemsTableSchema} items={items} />
      </section>
      <FloatingActionBar
        save={{
          label: (
            <FormattedMessage id="admin/return-app.return-request-details.verify-items.action.confirm" />
          ),
          isLoading: submitting,
          onClick: () => {},
        }}
        cancel={{
          label: (
            <FormattedMessage id="admin/return-app.return-request-details.verify-items.action.cancel" />
          ),
          onClick: onViewVerifyItems,
        }}
      />
    </>
  )
}
