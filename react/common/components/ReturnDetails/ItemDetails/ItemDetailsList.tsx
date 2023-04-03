import React from 'react'
import { Table } from 'vtex.styleguide'
import type {
  ReturnRequestItem,
  RefundData,
  Status,
  Maybe,
} from 'vtex.return-app'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'
import { useIntl } from 'react-intl'

import { useReturnDetails } from '../../../hooks/useReturnDetails'
import { itemDetailsSchema } from './itemDetailsSchema'
import { ItemDetailsCard } from './ItemDetailsCard'

type ItemStatus = 'new' | 'denied' | 'approved' | 'partiallyApproved'

const CSS_HANDLES = [
  'itemDetailsListContainer',
  'itemDetailsListWrapper',
] as const

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
  const handles = useCssHandles(CSS_HANDLES)

  const { formatMessage } = useIntl()
  const { data } = useReturnDetails()
  const {
    hints: { phone },
  } = useRuntime()

  if (!data) return null

  const { items, status, refundData, cultureInfoData } =
    data.returnRequestDetails

  const itemsVerificationStatus = getItemVerificationStatus(
    items,
    refundData,
    status
  )

  const { currencyCode } = cultureInfoData

  if (phone) {
    return (
      <section
        className={`${handles.itemDetailsListWrapper} mv4 flex flex-column`}
      >
        {items?.map((item) => {
          return (
            <ItemDetailsCard
              currencyCode={currencyCode}
              key={item.orderItemIndex}
              item={item}
              itemsVerificationStatus={itemsVerificationStatus}
            />
          )
        })}
      </section>
    )
  }

  return (
    <section className={handles.itemDetailsListContainer}>
      <Table
        fullWidth
        dynamicRowHeight
        items={items}
        schema={itemDetailsSchema({
          itemsVerificationStatus,
          currencyCode,
          formatMessage,
          isSmallScreen: phone,
        })}
      />
    </section>
  )
}
