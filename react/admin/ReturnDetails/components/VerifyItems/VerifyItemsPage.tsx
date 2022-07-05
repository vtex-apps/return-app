import React, { useState } from 'react'
import { FloatingActionBar } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import type { RefundItemInput } from 'vtex.return-app'

import { useReturnDetails } from '../../../hooks/useReturnDetails'
import { VerifyItemsTable } from './VerifyItemsTable'
import { VerifyTotalsTable } from './VerifyTotalsTable'
import { useUpdateRequestStatus } from '../../../hooks/useUpdateRequestStatus'

export type RefundItemMap = Map<
  number,
  { quantity: number; restockFee: number }
>

export type UpdateItemsChange = (args: {
  orderItemIndex: number
  restockFee?: number
  quantity?: number
}) => void

export type UpdateRefundShipping = (shippingToRefundInput: number) => void

interface Props {
  onViewVerifyItems: () => void
}

export const VerifyItemsPage = ({ onViewVerifyItems }: Props) => {
  const { data } = useReturnDetails()
  const { submitting, handleStatusUpdate } = useUpdateRequestStatus()
  const [refundItemsInput, setRefundItemsInput] = useState<RefundItemMap>(
    new Map()
  )

  const [shippingToRefund, setShippingToRefund] = useState(0)

  const {
    id: requestId,
    items = [],
    refundableAmountTotals = [],
  } = data?.returnRequestDetails ?? {}

  const handleItemChanges = ({
    orderItemIndex,
    restockFee,
    quantity,
  }: {
    orderItemIndex: number
    restockFee?: number
    quantity?: number
  }) => {
    const updatedRefundItemMap = new Map(refundItemsInput)
    const item = updatedRefundItemMap.get(orderItemIndex)
    const itemQuantity = quantity ?? item?.quantity ?? 0
    const itemRestockFee = restockFee ?? item?.restockFee ?? 0

    updatedRefundItemMap.set(orderItemIndex, {
      quantity: itemQuantity,
      restockFee: itemQuantity === 0 ? 0 : itemRestockFee,
    })

    setRefundItemsInput(updatedRefundItemMap)
  }

  const handleShippingChanges = (shippingToRefundInput: number) => {
    setShippingToRefund(shippingToRefundInput)
  }

  const onSave = async () => {
    if (!requestId || submitting) return

    const itemsToRefund: RefundItemInput[] = []

    for (const [
      orderItemIndex,
      { quantity, restockFee },
    ] of refundItemsInput.entries()) {
      itemsToRefund.push({
        orderItemIndex,
        quantity,
        restockFee,
      })
    }

    handleStatusUpdate({
      status: 'packageVerified',
      id: requestId,
      refundData: {
        refundedShippingValue: shippingToRefund,
        items: itemsToRefund,
      },
      cleanUp: onViewVerifyItems,
    })
  }

  const refundableShipping =
    refundableAmountTotals.find(({ id }) => id === 'shipping')?.value ?? 0

  const totalRefundItems = items.reduce((total, item) => {
    const { orderItemIndex, sellingPrice, tax } = item
    const returningItem = refundItemsInput.get(orderItemIndex)
    const { quantity = 0, restockFee = 0 } = returningItem ?? {}
    const itemTotal = (sellingPrice + tax) * quantity - restockFee

    return total + itemTotal
  }, 0)

  return (
    <>
      <section>
        <h2>
          <FormattedMessage id="admin/return-app.return-request-details.verify-items.title" />
        </h2>
        <VerifyItemsTable
          items={items}
          refundItemsInput={refundItemsInput}
          onItemChange={handleItemChanges}
        />
        <VerifyTotalsTable
          refundableShipping={refundableShipping}
          shippingToRefund={shippingToRefund}
          totalRefundItems={totalRefundItems}
          onRefundShippingChange={handleShippingChanges}
        />
      </section>
      <FloatingActionBar
        save={{
          label: (
            <FormattedMessage id="admin/return-app.return-request-details.verify-items.action.confirm" />
          ),
          isLoading: submitting,
          onClick: onSave,
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
