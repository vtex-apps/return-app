import React from 'react'
import type { ReactElement } from 'react'
import {
  Table,
  IconFailure,
  IconSuccess,
  IconWarning,
  IconClock,
} from 'vtex.styleguide'
import type {
  ReturnRequestItem,
  RefundData,
  Status,
  Maybe,
} from 'vtex.return-app'
import { FormattedCurrency } from 'vtex.format-currency'
import { FormattedMessage } from 'react-intl'

import { useReturnDetails } from '../../hooks/useReturnDetails'
import { AlignItemRight } from './AlignItemRight'

type ItemStatus = 'new' | 'denied' | 'approved' | 'partiallyApproved'

interface ItemStatusInterface {
  status: ItemStatus
  quantity: number
  quantityRefunded: number
}

const StrongChunk = (chunks: ReactElement) => <b>{chunks}</b>

const ItemStatusVerification = (props: ItemStatusInterface) => {
  const { status, quantity, quantityRefunded } = props

  switch (status) {
    case 'denied': {
      return (
        <div className="c-danger flex items-center">
          <span className="mr2 flex">
            <IconFailure size={14} />
          </span>
          <FormattedMessage id="admin/return-app.return-request-details.table.verification-status.denied" />
        </div>
      )
    }

    case 'approved': {
      return (
        <div className="c-success flex items-center">
          <span className="mr2 flex">
            <IconSuccess size={14} />
          </span>
          <FormattedMessage id="admin/return-app.return-request-details.table.verification-status.approved" />
        </div>
      )
    }

    case 'partiallyApproved': {
      return (
        <div className="c-warning flex items-center">
          <span className="mr2 flex">
            <IconWarning size={14} />
          </span>
          <FormattedMessage
            id="admin/return-app.return-request-details.table.verification-status.partially-approved"
            values={{ quantityRefunded, quantity }}
          />
        </div>
      )
    }

    default: {
      return (
        <div className="c-warning flex items-center">
          <span className="mr2 flex">
            <IconClock size={14} />
          </span>
          <FormattedMessage id="admin/return-app.return-request-details.table.verification-status.new" />
        </div>
      )
    }
  }
}

const itemDetailsSchema = (
  itemVerificationStatus: Map<number, ItemStatusInterface>
) => ({
  properties: {
    imageUrl: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.table.header.product" />
      ),
      width: 80,
      cellRenderer: function ProductImage({
        cellData,
        rowData,
      }: {
        cellData: ReturnRequestItem['imageUrl']
        rowData: ReturnRequestItem
      }) {
        return <img src={cellData} alt={rowData.name} />
      },
    },
    name: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.table.header.product-info" />
      ),
      minWidth: 500,
      cellRenderer: function ProductName({
        cellData,
        rowData,
      }: {
        cellData: ReturnRequestItem['name']
        rowData: ReturnRequestItem
      }) {
        const { refId, returnReason, sellerName } = rowData

        return (
          <div className="mv4">
            <span className="mv2">{cellData}</span>
            <div className="mv2">
              <FormattedMessage
                id="admin/return-app.return-request-details.table.product-info.ref-id"
                values={{
                  refId,
                  b: StrongChunk,
                }}
              />
            </div>
            <div className="mv2">
              <FormattedMessage
                id="admin/return-app.return-request-details.table.product-info.reason"
                values={{
                  reason: returnReason.otherReason ?? returnReason.reason,
                  b: StrongChunk,
                }}
              />
            </div>
            <div className="mv2">
              <FormattedMessage
                id="admin/return-app.return-request-details.table.product-info.sold-by"
                values={{
                  seller: sellerName,
                  b: StrongChunk,
                }}
              />
            </div>
          </div>
        )
      },
    },
    quantity: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.table.header.quantity" />
      ),
      width: 80,
    },
    sellingPrice: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.table.header.unit-price" />
      ),
      width: 90,
      headerRight: true,
      cellRenderer: function UnitPrice({
        cellData,
      }: {
        cellData: ReturnRequestItem['sellingPrice']
      }) {
        // TODO: Refactor this with right currency symbol and locale
        return (
          <AlignItemRight>
            <FormattedCurrency value={cellData / 100} />
          </AlignItemRight>
        )
      },
    },
    tax: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.table.header.tax" />
      ),
      width: 90,
      headerRight: true,
      cellRenderer: function Tax({
        cellData,
      }: {
        cellData: ReturnRequestItem['tax']
      }) {
        // TODO: Refactor this with right currency symbol and locale
        return (
          <AlignItemRight>
            <FormattedCurrency value={cellData / 100} />
          </AlignItemRight>
        )
      },
    },
    totalItems: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.table.header.total-price" />
      ),
      width: 90,
      headerRight: true,
      cellRenderer: function TotalPrice({
        rowData,
      }: {
        rowData: ReturnRequestItem
      }) {
        const { sellingPrice, tax } = rowData

        return (
          <AlignItemRight>
            <FormattedCurrency value={(sellingPrice + tax) / 100} />
          </AlignItemRight>
        )
      },
    },
    verificationStatus: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.table.header.verification-status" />
      ),
      cellRenderer: function VerificationStatus({
        rowData,
      }: {
        rowData: ReturnRequestItem
      }) {
        const { orderItemIndex } = rowData
        const itemStatus = itemVerificationStatus.get(orderItemIndex)

        if (!itemStatus) return null

        return <ItemStatusVerification {...itemStatus} />
      },
    },
  },
})

const calculateStatus = (
  status: Status,
  returnQuantity: number,
  refundedQuantity: number
): ItemStatus => {
  switch (status) {
    case 'denied': {
      return 'denied'
    }

    case 'packageVerified': {
      return refundedQuantity === 0
        ? 'denied'
        : returnQuantity > refundedQuantity
        ? 'partiallyApproved'
        : 'approved'
    }

    case 'amountRefunded': {
      return refundedQuantity === 0
        ? 'denied'
        : returnQuantity > refundedQuantity
        ? 'partiallyApproved'
        : 'approved'
    }

    default: {
      return 'new'
    }
  }
}

const getItemVerificationStatus = (
  items: ReturnRequestItem[],
  refundData: Maybe<RefundData | undefined>,
  status: Status
) => {
  const refundItemsMap = new Map<number, number>()

  for (const item of refundData?.items ?? []) {
    refundItemsMap.set(item.orderItemIndex, item.quantity)
  }

  const itemVerificationStatusMap = new Map<number, ItemStatusInterface>()

  for (const item of items) {
    const { quantity } = item
    const quantityRefunded = refundItemsMap.get(item.orderItemIndex) ?? 0

    itemVerificationStatusMap.set(item.orderItemIndex, {
      status: calculateStatus(status, quantity, quantityRefunded),
      quantity,
      quantityRefunded,
    })
  }

  return itemVerificationStatusMap
}

export const ItemDetailsList = () => {
  const { data } = useReturnDetails()

  if (!data) return null

  const { items, status, refundData } = data.returnRequestDetails

  const itemsVerificationStatus = getItemVerificationStatus(
    items,
    refundData,
    status
  )

  return (
    <section>
      <Table
        fullWidth
        dynamicRowHeight
        items={items}
        schema={itemDetailsSchema(itemsVerificationStatus)}
      />
    </section>
  )
}
