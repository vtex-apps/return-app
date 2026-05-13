import type { OrderDetailResponse } from '@vtex/clients'
import type { MasterDataEntity } from '@vtex/clients/build/clients/masterData/MasterDataEntity'
import type {
  AdjustmentNote,
  OrderToReturnSummary,
  ReturnAppSettings,
  ReturnRequest,
} from 'vtex.return-app'

import { createOrdersToReturnSummary } from '../utils/createOrdersToReturnSummary'
import { calculateLineItemTax } from '../utils/createItemsToReturn'
import type { CatalogGQL } from '../clients/catalogGQL'

export interface OrderItemStats {
  orderItemIndex: number
  uniqueId?: string
  id?: string
  productId?: string
  quantity?: number
  sellingPrice?: number
  taxAmount: number
  taxCode?: string
  amount: number
  quantityReturned: number
  quantityAvailableForReturn: number
  amountRefunded: number
  amountAvailableForRefund: number
  amountToRefund: number
  taxRefunded: number
  taxToRefund: number
  taxAvailableForRefund: number
}

export interface OrderDataStatsResult {
  orderId: string
  itemsReturned: number[]
  amountsReturned: number[]
  itemsAvailableForReturn: number[]
  amountsAvailableForReturn: number[]
  amountsToRefund: number[]
  itemsStats: OrderItemStats[]
  shippingRefunded: number
  shippingToRefund: number
  shippingAvailableForRefund: number
}

interface OrderDataStatsServiceSetup {
  excludedCategories: ReturnAppSettings['excludedCategories']
  returnRequestClient: MasterDataEntity<ReturnRequest>
  adjustmentNoteClient: MasterDataEntity<AdjustmentNote>
  catalogGQL: CatalogGQL
}

export const orderDataStatsService = async (
  order: OrderDetailResponse,
  orderId: string,
  {
    excludedCategories,
    returnRequestClient,
    adjustmentNoteClient,
    catalogGQL,
  }: OrderDataStatsServiceSetup
): Promise<OrderDataStatsResult> => {
  const orderItems = order.items ?? []
  const itemsCount = orderItems.length

  if (itemsCount === 0) {
    return {
      orderId,
      itemsReturned: [],
      amountsReturned: [],
      itemsAvailableForReturn: [],
      amountsAvailableForReturn: [],
      amountsToRefund: [],
      itemsStats: [],
      shippingRefunded: 0,
      shippingToRefund: 0,
      shippingAvailableForRefund: 0,
    }
  }

  // --- Items returned & amounts returned (based only on ReturnRequests + AdjustmentNotes) ---
  const itemsReturned: number[] = Array(itemsCount).fill(0)
  const amountsReturned: number[] = Array(itemsCount).fill(0)
  const amountsToRefund: number[] = Array(itemsCount).fill(0)
  let shippingRefunded = 0
  let shippingToRefund = 0
  const salesTaxRefundedByLine = Array(itemsCount).fill(0) as number[]
  const salesTaxToRefundByLine = Array(itemsCount).fill(0) as number[]

  // MasterData filtering does not allow combining two different status comparisons
  // in a single query reliably. Perform two searches and intersect the results by id.
  const [notCancelled, notDenied] = await Promise.all([
    returnRequestClient.search(
      { page: 1, pageSize: 100 },
      ['id', 'items', 'refundData', 'status'],
      undefined,
      `orderId=${orderId} AND status <> cancelled`
    ),
    returnRequestClient.search(
      { page: 1, pageSize: 100 },
      ['id', 'items', 'refundData', 'status'],
      undefined,
      `orderId=${orderId} AND status <> denied`
    ),
  ])

  const notDeniedIdSet = new Set((notDenied as any[]).map((doc) => doc.id))
  const returnRequestSameOrder = (notCancelled as any[]).filter((doc) =>
    notDeniedIdSet.has(doc.id)
  ) as ReturnRequest[]

  for (const returnRequest of returnRequestSameOrder ?? []) {
    const { items: rmaItems, refundData, status } = returnRequest ?? {}
    const approvedItems = refundData?.items

    // For itemsReturned we follow the same logic used when validating creation:
    // use approved items (refundData.items) when available, otherwise use the original request items.
    const itemsToCommit =
      approvedItems && approvedItems.length > 0 ? approvedItems : rmaItems

    for (const item of itemsToCommit ?? []) {
      const { orderItemIndex, quantity } = item

      if (
        orderItemIndex === undefined ||
        quantity === undefined ||
        orderItemIndex < 0 ||
        orderItemIndex >= itemsCount
      ) {
        continue
      }

      itemsReturned[orderItemIndex] += quantity
    }

    // For amountsReturned, use the persisted refundData items to compute per line item value.
    // Only include amounts from return requests with status 'amountRefunded' or 'closed'
    if (status === 'amountRefunded' || status === 'closed') {
      for (const refundItem of refundData?.items ?? []) {
        const { orderItemIndex, quantity, price, restockFee } = refundItem

        if (
          orderItemIndex === undefined ||
          quantity === undefined ||
          orderItemIndex < 0 ||
          orderItemIndex >= itemsCount
        ) {
          continue
        }

        const lineAmount = (price ?? 0) * (quantity ?? 0) - (restockFee ?? 0)

        amountsReturned[orderItemIndex] += lineAmount
      }

      // Add shipping refunded from return requests
      const refundedShipping = refundData?.refundedShippingValue ?? 0

      shippingRefunded += refundedShipping
    }
  }

  // Include adjustment notes amounts, assigned per line using additionalInfo.items metadata
  const adjustmentNotesResult = await adjustmentNoteClient.searchRaw(
    {
      page: 1,
      pageSize: 100,
    },
    [
      'status',
      'transactionData',
      'additionalInfo',
      'refundType',
      'requestAmount',
    ],
    'createdIn DESC',
    `orderId="${orderId}"`
  )

  const adjustmentNotes = (adjustmentNotesResult.data ?? []) as AdjustmentNote[]

  for (const note of adjustmentNotes ?? []) {
    const status = (note as any).status as string | undefined
    const additionalInfoRaw = (note as any).additionalInfo as string | undefined
    const refundType = (note as any).refundType as string | undefined

    // Handle DeliveryFee adjustment notes (shipping refunds)
    if (refundType === 'DeliveryFee') {
      const transactionData = (note as any).transactionData as any
      const requestAmountRaw = (note as any).requestAmount
      const requestAmount = Number(requestAmountRaw) || 0

      if (status === 'refunded' || status === 'charged') {
        const invoiceValueRaw = transactionData?.invoiceValue
        const invoiceValue = Number(invoiceValueRaw) || 0

        shippingRefunded += invoiceValue
      } else {
        // For pending/authorized notes, use requestAmount
        shippingToRefund += requestAmount
      }

      // Skip item processing for DeliveryFee notes
      continue
    }

    // SalesTax: per-line amounts from additionalInfo.items (same shape as other adjustment notes)
    if (refundType === 'SalesTax') {
      if (!additionalInfoRaw) {
        continue
      }

      let parsedSalesTax: any

      try {
        parsedSalesTax = JSON.parse(additionalInfoRaw)
      } catch {
        continue
      }

      if (!parsedSalesTax?.items || !Array.isArray(parsedSalesTax.items)) {
        continue
      }

      if (status === 'refunded' || status === 'charged') {
        for (const item of parsedSalesTax.items) {
          const { orderItemIndex, amount } = item ?? {}

          if (
            typeof orderItemIndex !== 'number' ||
            orderItemIndex < 0 ||
            orderItemIndex >= itemsCount
          ) {
            continue
          }

          const lineAmount = typeof amount === 'number' ? amount : 0

          salesTaxRefundedByLine[orderItemIndex] += lineAmount
          amountsReturned[orderItemIndex] += lineAmount
        }
      } else {
        for (const item of parsedSalesTax.items) {
          const { orderItemIndex, amount } = item ?? {}

          if (
            typeof orderItemIndex !== 'number' ||
            orderItemIndex < 0 ||
            orderItemIndex >= itemsCount
          ) {
            continue
          }

          const lineAmount = typeof amount === 'number' ? amount : 0

          salesTaxToRefundByLine[orderItemIndex] += lineAmount
          amountsToRefund[orderItemIndex] += lineAmount
        }
      }

      continue
    }

    if (!additionalInfoRaw) continue

    let parsed: any

    try {
      parsed = JSON.parse(additionalInfoRaw)
    } catch {
      // Ignore malformed additionalInfo
      continue
    }

    if (!parsed?.items || !Array.isArray(parsed.items)) {
      continue
    }

    // Only consider notes that effectively refund/charge value for amountsReturned
    if (status === 'refunded' || status === 'charged') {
      for (const item of parsed.items) {
        const { orderItemIndex, amount } = item ?? {}

        if (
          typeof orderItemIndex !== 'number' ||
          orderItemIndex < 0 ||
          orderItemIndex >= itemsCount
        ) {
          continue
        }

        const lineAmount = typeof amount === 'number' ? amount : 0

        amountsReturned[orderItemIndex] += lineAmount
      }
    } else {
      // Calculate amountsToRefund for notes that are not refunded/charged
      for (const item of parsed.items) {
        const { orderItemIndex, amount } = item ?? {}

        if (
          typeof orderItemIndex !== 'number' ||
          orderItemIndex < 0 ||
          orderItemIndex >= itemsCount
        ) {
          continue
        }

        const lineAmount = typeof amount === 'number' ? amount : 0

        amountsToRefund[orderItemIndex] += lineAmount
      }
    }
  }

  // --- Items available for return & amounts available (based on order + previous processing) ---
  const summary: OrderToReturnSummary = await createOrdersToReturnSummary(
    order,
    // Email is not relevant for the calculation itself. We follow the same pattern used
    // on validations where a static value is passed.
    'email',
    {
      excludedCategories,
      returnRequestClient,
      catalogGQL,
    }
  )

  const itemAvailableMap: number[] = Array(itemsCount).fill(0)

  const excludedItemsIndexMap = new Map<number, boolean>()

  for (const excludedItem of summary.excludedItems ?? []) {
    excludedItemsIndexMap.set(excludedItem.itemIndex, true)
  }

  const processedItemsQuantityIndexMap = new Map<number, number>()

  for (const processedItem of summary.processedItems ?? []) {
    processedItemsQuantityIndexMap.set(
      processedItem.itemIndex,
      processedItem.quantity
    )
  }

  for (let i = 0; i < (summary.invoicedItems?.length ?? 0); i++) {
    const { orderItemIndex, quantity } = summary.invoicedItems![i]

    if (
      orderItemIndex === undefined ||
      orderItemIndex < 0 ||
      orderItemIndex >= itemsCount
    ) {
      continue
    }

    const isExcluded = excludedItemsIndexMap.get(orderItemIndex) ?? false
    const processedQuantity =
      processedItemsQuantityIndexMap.get(orderItemIndex) ?? 0

    const quantityAvailable = isExcluded ? 0 : quantity - processedQuantity

    itemAvailableMap[orderItemIndex] = Math.max(quantityAvailable, 0)
  }

  const itemsAvailableForReturn = itemAvailableMap

  const lineTaxTotals = orderItems.map((_, index) => {
    const item = orderItems[index] as any
    const selling = Number((item?.sellingPrice as number | undefined) ?? 0)
    const taxValue = Number((item?.tax as number | undefined) ?? 0)
    const priceTags = (item?.priceTags as any[]) ?? []
    const quantity = (item?.quantity as number | undefined) ?? 0

    return calculateLineItemTax({
      tax: taxValue,
      priceTags,
      quantity,
      sellingPrice: selling,
    })
  })

  // Amount available to refund: line net + line tax (same line totals as `taxAmount`), minus refunded.
  const amountsAvailableForReturn = orderItems.map((_, index) => {
    const item = orderItems[index] as any
    const selling = Number((item?.sellingPrice as number | undefined) ?? 0)
    const quantity = (item?.quantity as number | undefined) ?? 0
    const lineTaxTotal = lineTaxTotals[index] ?? 0
    const baseAmount = selling * quantity + lineTaxTotal

    const refunded = amountsReturned[index] ?? 0

    return Math.max(0, baseAmount - refunded)
  })

  const buildItemMetadata = (index: number): OrderItemStats => {
    const item = orderItems[index] as any
    const selling = Number((item?.sellingPrice as number | undefined) ?? 0)
    const quantity = (item?.quantity as number | undefined) ?? 0
    const lineTaxTotal = lineTaxTotals[index] ?? 0
    const baseAmount = selling * quantity + lineTaxTotal

    const amountRefunded = amountsReturned[index] ?? 0
    const amountAvailableForRefund = amountsAvailableForReturn[index] ?? 0
    const amountToRefundLine = amountsToRefund[index] ?? 0

    const taxRefunded = salesTaxRefundedByLine[index] ?? 0
    const taxToRefund = salesTaxToRefundByLine[index] ?? 0
    const taxAvailableForRefund = Math.max(0, lineTaxTotal - taxRefunded)

    return {
      orderItemIndex: index,
      uniqueId: item?.uniqueId,
      id: item?.id,
      productId: item?.productId,
      quantity: item?.quantity,
      sellingPrice: item?.sellingPrice,
      taxAmount: lineTaxTotal,
      taxCode: item?.taxCode,
      amount: baseAmount,
      quantityReturned: itemsReturned[index] ?? 0,
      quantityAvailableForReturn: itemsAvailableForReturn[index] ?? 0,
      amountRefunded,
      amountAvailableForRefund,
      amountToRefund: amountToRefundLine,
      taxRefunded,
      taxToRefund,
      taxAvailableForRefund,
    }
  }

  const itemsStats = orderItems.map((_, index) => buildItemMetadata(index))

  // Calculate shipping available for return
  const orderShippingTotal =
    order.totals?.find(({ id }) => id === 'Shipping')?.value ?? 0

  const shippingAvailableForRefund = Math.max(
    0,
    orderShippingTotal - shippingRefunded
  )

  return {
    orderId,
    itemsReturned,
    amountsReturned,
    itemsAvailableForReturn,
    amountsAvailableForReturn,
    amountsToRefund,
    itemsStats,
    shippingRefunded,
    shippingToRefund,
    shippingAvailableForRefund,
  }
}
