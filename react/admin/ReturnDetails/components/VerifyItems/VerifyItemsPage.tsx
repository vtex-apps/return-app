import React, { useState } from 'react'
import { FloatingActionBar, ModalDialog } from 'vtex.styleguide'
import { FormattedMessage, FormattedNumber } from 'react-intl'
import type { RefundItemInput } from 'vtex.return-app'

import { useReturnDetails } from '../../../../common/hooks/useReturnDetails'
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

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [shippingToRefund, setShippingToRefund] = useState(0)

  const {
    id: requestId,
    items = [],
    refundableAmountTotals = [],
    cultureInfoData,
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
          onClick: () => setIsModalOpen(true),
        }}
        cancel={{
          label: (
            <FormattedMessage id="admin/return-app.return-request-details.verify-items.action.cancel" />
          ),
          onClick: onViewVerifyItems,
        }}
      />
      <ModalDialog
        centered
        confirmation={{
          onClick: onSave,
          label: 'Yes',
        }}
        cancelation={{
          onClick: () => setIsModalOpen(false),
          label: 'Cancel',
        }}
        isOpen={isModalOpen}
        onClose={onViewVerifyItems}
      >
        <div className="">
          <p className="f3 f3-ns fw3 b">
            <FormattedMessage id="admin/return-app.return-request-details.verify-items.modal.title" />
          </p>
          <div>
            {items.map((item) => {
              return (
                <>
                  <div className="flex" key={item.refId}>
                    <p className="f6 mr5 gray b">
                      <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.product" />
                      :
                    </p>
                    <p className="f6 gray">{item.name}</p>
                  </div>
                  <div className="flex" key={item.refId}>
                    <p className="f6 mr5 gray b">
                      <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.quantity" />
                      :
                    </p>
                    <p className="f6 gray">{item.quantity}</p>
                  </div>
                </>
              )
            })}
          </div>
          <div className="flex">
            <p className="f6 mr5 gray b">
              <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.shipping-to-refund" />
              :
            </p>
            <p className="f6 gray">
              <FormattedNumber
                value={Number(shippingToRefund) / 100}
                currency={cultureInfoData.currencyCode}
                style="currency"
              />
            </p>
          </div>
          <div className="flex">
            <p className="f6 mr5 gray b">
              <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.total-refund-items" />
              :
            </p>
            <p className="f6 gray">
              <FormattedNumber
                value={Number(totalRefundItems) / 100}
                currency={cultureInfoData.currencyCode}
                style="currency"
              />
            </p>
          </div>
          <div className="flex">
            <p className="f6 mr5 gray b">
              <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.total-refund" />
              :
            </p>
            <p className="f6 gray">
              <FormattedNumber
                value={
                  (Number(shippingToRefund) + Number(totalRefundItems)) / 100
                }
                currency={cultureInfoData.currencyCode}
                style="currency"
              />
            </p>
          </div>
        </div>
      </ModalDialog>
    </>
  )
}
