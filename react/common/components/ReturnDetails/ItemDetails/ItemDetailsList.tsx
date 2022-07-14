import React from 'react'
import { Table } from 'vtex.styleguide'
import type {
  ReturnRequestItem,
  RefundData,
  Status,
  Maybe,
} from 'vtex.return-app'

import { useReturnDetails } from '../../../hooks/useReturnDetails'
import { itemDetailsSchema } from './itemDetailsSchema'

type ItemStatus = 'new' | 'denied' | 'approved' | 'partiallyApproved'

export interface ItemStatusInterface {
  status: ItemStatus
  quantity: number
  quantityRefunded: number
}

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

  const { items, status, refundData, cultureInfoData } =
    data.returnRequestDetails

  const itemsVerificationStatus = getItemVerificationStatus(
    items,
    refundData,
    status
  )

  const { currencyCode } = cultureInfoData

  return (
    <section>
      <Table
        fullWidth
        dynamicRowHeight
        items={items}
        schema={itemDetailsSchema(itemsVerificationStatus, currencyCode)}
      />
    </section>
  )
}
