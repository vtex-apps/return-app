import type { ReactElement } from 'react'
import React from 'react'
import { Box } from 'vtex.styleguide'
import type { ReturnRequestItem } from 'vtex.return-app'
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { defaultReturnConditionsMessages } from '../../../utils/defaultReturnConditionsMessages'
import type { ItemStatusInterface } from './ItemDetailsList'
import { ItemVerificationStatus } from './ItemVerificationStatus'

const SpanChunk = (chunks: ReactElement) => <span>{chunks}</span>

const CSS_HANDLES = [
  'cardWrapper',
  'statusWrapper',
  'productImageWrapper',
  'productImage',
  'productDetailsWrapper',
  'productNameWrapper',
  'productName',
  'productRefWrapper',
  'productReasonWrapper',
  'productConditionWrapper',
  'productSellerWrapper',
  'productQuantityWrapper',
  'productSellingPriceWrapper',
  'productTaxWrapper',
  'productTotalWrapper',
  'productKey',
  'productValue',
] as const

type Props = {
  item: ReturnRequestItem
  currencyCode: string
  itemsVerificationStatus: Map<number, ItemStatusInterface>
}

export const ItemDetailsCard = ({
  item,
  itemsVerificationStatus,
  currencyCode,
}: Props) => {
  const handles = useCssHandles(CSS_HANDLES)
  const { formatMessage } = useIntl()
  const {
    name,
    localizedName,
    orderItemIndex,
    sellingPrice,
    tax,
    quantity,
    refId,
    returnReason,
    condition,
    sellerName,
  } = item

  const itemStatus = itemsVerificationStatus.get(orderItemIndex)

  return (
    <div className={`${handles.cardWrapper} mb4 relative`}>
      <Box>
        <div className={`${handles.statusWrapper} absolute top-1 right-1`}>
          {itemStatus && <ItemVerificationStatus {...itemStatus} />}
        </div>
        <div className={`${handles.productImageWrapper} flex`}>
          <img
            className={`${handles.productImage}`}
            src={item.imageUrl}
            alt="product"
          />
        </div>
        <div className={`${handles.productDetailsWrapper} flex flex-column`}>
          <div className={`${handles.productNameWrapper} mb4`}>
            <span className={`${handles.productName}`}>
              {localizedName ?? name}
            </span>
          </div>

          {!refId ? null : (
            <div className={`${handles.productRefWrapper} mb2`}>
              <FormattedMessage
                id="store/return-app.return-request-details.table.product-info.ref-id"
                values={{
                  refId,
                  b: SpanChunk,
                }}
              />
            </div>
          )}

          <div className={`${handles.productReasonWrapper} mb2`}>
            <FormattedMessage
              id="store/return-app.return-request-details.table.product-info.reason"
              values={{
                reason: returnReason.otherReason ?? returnReason.reason,
                b: SpanChunk,
              }}
            />
          </div>

          {condition === 'unspecified' ? null : (
            <div className={`${handles.productConditionWrapper} mb2`}>
              <FormattedMessage
                id="store/return-app.return-request-details.table.product-info.condition"
                values={{
                  condition: formatMessage(
                    defaultReturnConditionsMessages[condition]
                  ),
                  b: SpanChunk,
                }}
              />
            </div>
          )}

          {!sellerName ? null : (
            <div className={`${handles.productSellerWrapper} mb2`}>
              <FormattedMessage
                id="store/return-app.return-request-details.table.product-info.sold-by"
                values={{
                  seller: sellerName,
                  b: SpanChunk,
                }}
              />
            </div>
          )}

          <div className={`${handles.productQuantityWrapper} mb2`}>
            <span className={`${handles.productKey} mr2`}>
              <FormattedMessage id="store/return-app.return-request-details.table.header.quantity" />
              :
            </span>
            <span className={`${handles.productValue}`}>{quantity}</span>
          </div>

          <div className={`${handles.productSellingPriceWrapper} mb2`}>
            <span className={`${handles.productKey} mr2`}>
              <FormattedMessage id="store/return-app.return-request-details.table.header.unit-price" />
              :
            </span>
            <span className={`${handles.productValue}`}>
              <FormattedNumber
                value={sellingPrice / 100}
                style="currency"
                currency={currencyCode}
              />
            </span>
          </div>

          <div className={`${handles.productTaxWrapper} mb2`}>
            <span className={`${handles.productKey} mr2`}>
              <FormattedMessage id="store/return-app.return-request-details.table.header.tax" />
              :
            </span>

            <span className={`${handles.productValue}`}>
              <FormattedNumber
                value={tax / 100}
                style="currency"
                currency={currencyCode}
              />
            </span>
          </div>

          <div className={`${handles.productTotalWrapper}`}>
            <span className={`${handles.productKey} mr2`}>
              <FormattedMessage id="store/return-app.return-request-details.table.header.total-price" />
              :
            </span>

            <span className={`${handles.productValue}`}>
              <FormattedNumber
                value={((sellingPrice + tax) * quantity) / 100}
                style="currency"
                currency={currencyCode}
              />
            </span>
          </div>
        </div>
      </Box>
    </div>
  )
}

export default ItemDetailsCard
