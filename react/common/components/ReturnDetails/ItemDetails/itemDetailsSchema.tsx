import type { ReactElement } from 'react'
import React from 'react'
import type { IntlFormatters } from 'react-intl'
import { FormattedMessage, FormattedNumber } from 'react-intl'
import type { ReturnRequestItem } from '../../../../../typings/ReturnRequest'

import type { ItemStatusInterface } from './ItemDetailsList'
import { AlignItemRight } from '../../../../admin/ReturnDetails/components/AlignItemRight'
import { ItemVerificationStatus } from './ItemVerificationStatus'
import ItemName from './ItemName'
import { defaultReturnConditionsMessages } from '../../../utils/defaultReturnConditionsMessages'

const StrongChunk = (chunks: ReactElement) => <b>{chunks}</b>

interface Props {
  itemsVerificationStatus: Map<number, ItemStatusInterface>
  currencyCode: string
  formatMessage: IntlFormatters['formatMessage']
  isSmallScreen: boolean
}

export const itemDetailsSchema = ({
  itemsVerificationStatus,
  currencyCode,
  formatMessage,
  isSmallScreen,
}: Props) => {
  const properties = {
    imageUrl: {
      title: (
        <FormattedMessage id="return-app.return-request-details.table.header.product" />
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
        <FormattedMessage id="return-app.return-request-details.table.header.product-info" />
      ),
      minWidth: 500,
      cellRenderer: function ProductName({
        cellData,
        rowData,
      }: {
        cellData: ReturnRequestItem['name']
        rowData: ReturnRequestItem
      }) {
        const { refId, returnReason, sellerName, localizedName, condition } =
          rowData

        return (
          <div className="mv4">
            <div className="mv2 flex flex-column">
              <ItemName name={cellData} localizedName={localizedName} />
            </div>
            {!refId ? null : (
              <div className="mv2">
                <FormattedMessage
                  id="return-app.return-request-details.table.product-info.ref-id"
                  values={{
                    refId,
                    b: StrongChunk,
                  }}
                />
              </div>
            )}
            <div className="mv2">
              <FormattedMessage
                id="return-app.return-request-details.table.product-info.reason"
                values={{
                  reason: returnReason.otherReason ?? returnReason.reason,
                  b: StrongChunk,
                }}
              />
            </div>
            {condition === 'unspecified' ? null : (
              <div className="mv2">
                <FormattedMessage
                  id="return-app.return-request-details.table.product-info.condition"
                  values={{
                    condition: formatMessage(
                      defaultReturnConditionsMessages[condition]
                    ),
                    b: StrongChunk,
                  }}
                />
              </div>
            )}
            {!sellerName ? null : (
              <div className="mv2">
                <FormattedMessage
                  id="return-app.return-request-details.table.product-info.sold-by"
                  values={{
                    seller: sellerName,
                    b: StrongChunk,
                  }}
                />
              </div>
            )}
          </div>
        )
      },
    },
    quantity: {
      title: (
        <FormattedMessage id="return-app.return-request-details.table.header.quantity" />
      ),
      width: 80,
    },
    sellingPrice: {
      title: (
        <FormattedMessage id="return-app.return-request-details.table.header.unit-price" />
      ),
      width: 120,
      headerRight: true,
      cellRenderer: function UnitPrice({
        cellData,
      }: {
        cellData: ReturnRequestItem['sellingPrice']
      }) {
        return (
          <AlignItemRight>
            <FormattedNumber
              value={cellData / 100}
              style="currency"
              currency={currencyCode}
            />
          </AlignItemRight>
        )
      },
    },
    tax: {
      title: (
        <FormattedMessage id="return-app.return-request-details.table.header.tax" />
      ),
      width: 120,
      headerRight: true,
      cellRenderer: function Tax({
        cellData,
      }: {
        cellData: ReturnRequestItem['tax']
      }) {
        return (
          <AlignItemRight>
            <FormattedNumber
              value={cellData / 100}
              style="currency"
              currency={currencyCode}
            />
          </AlignItemRight>
        )
      },
    },
    totalItems: {
      title: (
        <FormattedMessage id="return-app.return-request-details.table.header.total-price" />
      ),
      width: 120,
      headerRight: true,
      cellRenderer: function TotalPrice({
        rowData,
      }: {
        rowData: ReturnRequestItem
      }) {
        const { sellingPrice, tax, quantity } = rowData

        return (
          <AlignItemRight>
            <FormattedNumber
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              value={((sellingPrice + tax) * quantity) / 100}
              style="currency"
              currency={currencyCode}
            />
          </AlignItemRight>
        )
      },
    },
    verificationStatus: {
      title: (
        <FormattedMessage id="return-app.return-request-details.table.header.verification-status" />
      ),
      minWidth: 150,
      cellRenderer: function VerificationStatus({
        rowData,
      }: {
        rowData: ReturnRequestItem
      }) {
        const { orderItemIndex } = rowData
        const itemStatus = itemsVerificationStatus.get(orderItemIndex)

        if (!itemStatus) return null

        return <ItemVerificationStatus {...itemStatus} />
      },
    },
  }

  const mobileOrder = {
    imageUrl: null,
    name: null,
    verificationStatus: null,
  }

  return {
    properties: isSmallScreen
      ? Object.assign(mobileOrder, properties)
      : properties,
  }
}
