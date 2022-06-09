import type { ChangeEvent, FC } from 'react'
import React, { useState } from 'react'
import {
  Table,
  FloatingActionBar,
  InputCurrency,
  NumericStepper,
  IconSuccess,
  IconFailure,
  IconWarning,
} from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import type { ReturnRequestItem, RefundItemInput } from 'vtex.return-app'
import { FormattedCurrency } from 'vtex.format-currency'

import { useReturnDetails } from '../../hooks/useReturnDetails'

type ActionStatus = 'deny' | 'approve' | 'partially-approve'

const getActionStatus = ({
  quantity,
  selectedQuantity,
}: {
  quantity: number
  selectedQuantity: number
}): ActionStatus =>
  selectedQuantity === 0
    ? 'deny'
    : selectedQuantity === quantity
    ? 'approve'
    : 'partially-approve'

const AlignItemRight: FC = ({ children }) => (
  <span className="flex justify-end w-100">{children}</span>
)

const ProductActionStatus = ({
  actionStatus,
}: {
  actionStatus: ActionStatus
}) => {
  return (
    <>
      {actionStatus !== 'approve' ? null : (
        <div className="c-success flex items-center">
          <span className="mr2 flex">
            <IconSuccess size={14} />
          </span>
          <FormattedMessage id="admin/return-app.return-request-details.verify-items.action.approve" />
        </div>
      )}
      {actionStatus !== 'deny' ? null : (
        <div className="c-danger flex items-center">
          <span className="mr2 flex">
            <IconFailure size={14} />
          </span>
          <FormattedMessage id="admin/return-app.return-request-details.verify-items.action.deny" />
        </div>
      )}
      {actionStatus !== 'partially-approve' ? null : (
        <div className="c-warning flex items-center">
          <span className="mr2 flex">
            <IconWarning size={14} />
          </span>
          <FormattedMessage id="admin/return-app.return-request-details.verify-items.action.partially-approve" />
        </div>
      )}
    </>
  )
}

type RefundItemMap = Map<number, { quantity: number; restockFee: number }>

const verifyItemsTableSchema = (
  refundItemMap: RefundItemMap,
  updateChanges: (args: {
    orderItemIndex: number
    restockFee?: number
    quantity?: number
  }) => void
) => ({
  properties: {
    name: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.product" />
      ),
      minWidth: 320,
    },
    sellingPrice: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.price" />
      ),
      width: 90,
      headerRight: true,
      // eslint-disable-next-line react/display-name
      cellRenderer: ({
        cellData,
      }: {
        rowData: ReturnRequestItem
        cellData: ReturnRequestItem['sellingPrice']
      }) => {
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
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.tax" />
      ),
      width: 90,
      headerRight: true,
      // eslint-disable-next-line react/display-name
      cellRenderer: ({
        cellData,
      }: {
        rowData: ReturnRequestItem
        cellData: ReturnRequestItem['tax']
      }) => {
        // TODO: Refactor this with right currency symbol and locale
        return (
          <AlignItemRight>
            <FormattedCurrency value={cellData / 100} />
          </AlignItemRight>
        )
      },
    },
    totalPrice: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.total" />
      ),
      width: 90,
      headerRight: true,
      // eslint-disable-next-line react/display-name
      cellRenderer: ({ rowData }: { rowData: ReturnRequestItem }) => {
        const { sellingPrice, tax } = rowData

        // TODO: Refactor this with right currency symbol and locale
        return (
          <AlignItemRight>
            <FormattedCurrency value={(sellingPrice + tax) / 100} />
          </AlignItemRight>
        )
      },
    },
    quantity: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.quantity" />
      ),
      width: 80,
      // eslint-disable-next-line react/display-name
      cellRenderer: ({
        cellData,
      }: {
        rowData: ReturnRequestItem
        cellData: ReturnRequestItem['quantity']
      }) => {
        return <span className="w-100 flex justify-center">{cellData}</span>
      },
    },
    verified: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.verified" />
      ),
      width: 160,
      // eslint-disable-next-line react/display-name
      cellRenderer: ({ rowData }: { rowData: ReturnRequestItem }) => {
        const { orderItemIndex, quantity } = rowData

        const handleChange = ({ value }: { value: number }) => {
          updateChanges({ quantity: value, orderItemIndex })
        }

        const selectedQuantity =
          refundItemMap.get(orderItemIndex)?.quantity ?? 0

        return (
          <NumericStepper
            value={selectedQuantity}
            maxValue={quantity}
            onChange={handleChange}
          />
        )
      },
    },
    restockFee: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.restock-fee" />
      ),
      width: 150,
      // eslint-disable-next-line react/display-name
      cellRenderer: ({ rowData }: { rowData: ReturnRequestItem }) => {
        const { sellingPrice, tax, orderItemIndex } = rowData

        const refundItem = refundItemMap.get(orderItemIndex)
        const restockFee = refundItem?.restockFee ?? 0
        const selectedQuantity = refundItem?.quantity ?? 0

        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
          const { value } = event.target
          const restockFeeInput = Number(value)

          const restockFeeInputParsed = Number.isNaN(restockFeeInput)
            ? 0
            : restockFeeInput

          const restockFeeCents = parseFloat(
            (restockFeeInputParsed * 100).toFixed(0)
          )

          const maxRestockFee = (sellingPrice + tax) * selectedQuantity

          const restockFeeChecked =
            restockFeeCents > maxRestockFee ? maxRestockFee : restockFeeCents

          updateChanges({ restockFee: restockFeeChecked, orderItemIndex })
        }

        // TODO: Refactor this with right currency symbol and locale
        return (
          <InputCurrency
            value={restockFee / 100}
            currencyCode="EUR"
            locale="es-ES"
            onChange={handleChange}
            disabled={selectedQuantity === 0}
          />
        )
      },
    },
    totalRefund: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.refund-product-total" />
      ),
      headerRight: true,
      width: 90,
      // eslint-disable-next-line react/display-name
      cellRenderer: ({ rowData }: { rowData: ReturnRequestItem }) => {
        const { sellingPrice, tax, orderItemIndex } = rowData

        const refundItem = refundItemMap.get(orderItemIndex)
        const selectedQuantity = refundItem?.quantity ?? 0
        const restockFee = refundItem?.restockFee ?? 0

        // TODO: Refactor this with right currency symbol and locale
        return (
          <AlignItemRight>
            <FormattedCurrency
              value={
                ((sellingPrice + tax) * selectedQuantity - restockFee) / 100
              }
            />
          </AlignItemRight>
        )
      },
    },
    action: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.action" />
      ),
      // eslint-disable-next-line react/display-name
      cellRenderer: ({ rowData }: { rowData: ReturnRequestItem }) => {
        const { quantity, orderItemIndex } = rowData

        const selectedQuantity =
          refundItemMap.get(orderItemIndex)?.quantity ?? 0

        const actionStatus = getActionStatus({ quantity, selectedQuantity })

        return <ProductActionStatus actionStatus={actionStatus} />
      },
    },
  },
})

const totalsSchema = (
  handleShippingChanges: (shippingToRefundInput: number) => void
) => ({
  properties: {
    refundableShipping: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.refundable-shipping" />
      ),
      headerRight: true,
      // eslint-disable-next-line react/display-name
      cellRenderer: ({ cellData }: { cellData: number }) => {
        // TODO: Refactor this with right currency symbol and locale
        return (
          <AlignItemRight>
            <FormattedCurrency value={cellData / 100} />
          </AlignItemRight>
        )
      },
    },
    shippingToRefund: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.shipping-to-refund" />
      ),
      headerRight: true,
      // eslint-disable-next-line react/display-name
      cellRenderer: ({
        cellData,
        rowData,
      }: {
        cellData: number
        rowData: { refundableShipping: number }
      }) => {
        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
          const { refundableShipping } = rowData
          const { value } = event.target
          const shippingToRefundInput = Number(value)

          const shippingToRefundParsed = Number.isNaN(shippingToRefundInput)
            ? 0
            : shippingToRefundInput * 100

          const shippingToRefundChecked =
            shippingToRefundParsed > refundableShipping
              ? refundableShipping
              : shippingToRefundParsed

          handleShippingChanges(shippingToRefundChecked)
        }

        // TODO: Refactor this with right currency symbol and locale
        return (
          <AlignItemRight>
            <InputCurrency
              value={cellData / 100}
              currencyCode="EUR"
              locale="es-ES"
              onChange={handleChange}
            />
          </AlignItemRight>
        )
      },
    },
    totalRefundItems: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.total-refund-items" />
      ),
      headerRight: true,
      // eslint-disable-next-line react/display-name
      cellRenderer: ({ cellData }: { cellData: number }) => {
        // TODO: Refactor this with right currency symbol and locale
        return (
          <AlignItemRight>
            <FormattedCurrency value={cellData / 100} />
          </AlignItemRight>
        )
      },
    },
    totalRefund: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.total-refund" />
      ),
      headerRight: true,
      // eslint-disable-next-line react/display-name
      cellRenderer: ({ cellData }: { cellData: number }) => {
        // TODO: Refactor this with right currency symbol and locale
        return (
          <AlignItemRight>
            <FormattedCurrency value={cellData / 100} />
          </AlignItemRight>
        )
      },
    },
  },
})

interface Props {
  onViewVerifyItems: () => void
}

export const VerifyItemsPage = ({ onViewVerifyItems }: Props) => {
  const { submitting, data, handleStatusUpdate } = useReturnDetails()
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
        <div>
          <h3>Items</h3>
          <Table
            fullWidth
            fixFirstColumn
            schema={verifyItemsTableSchema(refundItemsInput, handleItemChanges)}
            items={items}
          />
        </div>
        <div>
          <h3>Totals</h3>
          <Table
            fullWidth
            schema={totalsSchema(handleShippingChanges)}
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
