import React, { useState } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { PageHeader, PageBlock } from 'vtex.styleguide'
import type { RouteComponentProps } from 'react-router'
import { FormattedMessage } from 'react-intl'
import type {
  ReturnRequestInput,
  ReturnRequestItemInput,
} from 'vtex.return-app'

import { StoreSettingsPovider } from '../provider/StoreSettingsProvider'
import { OrderToReturnProvider } from '../provider/OrderToReturnProvider'
import { ReturnDetails } from './components/ReturnDetails'
import { ConfirmAndSubmit } from './components/ConfirmAndSubmit'
import type { OrderDetailsState } from '../provider/OrderToReturnReducer'

export type Page = 'form-details' | 'submit-form'

const isItemToReturn = (
  item: OrderDetailsState['items'][0]
): item is ReturnRequestItemInput => {
  // TODO: if return other, validate user input
  return Boolean(item.condition) && Boolean(item.returnReason)
}

export const ReturnDetailsContainer = (
  props: RouteComponentProps<{ orderId: string }>
) => {
  const [page, setPage] = useState<Page>('form-details')
  const [returnRequestArgs, setReturnRequestArgs] =
    useState<ReturnRequestInput | null>(null)

  const { navigate } = useRuntime()

  const handlePageChange = (selectedPage: Page) => {
    /**
     * We want to clean the validate state when user goes page to form page.
     * This way we ensure the app validates the form again.
     */
    if (selectedPage === 'form-details') {
      setReturnRequestArgs(null)
    }

    setPage(selectedPage)
  }

  const validateReturnFields = (returnRequest: OrderDetailsState) => {
    // validate terms and condition mark

    const { items, pickupReturnData, customerProfileData, refundPaymentData } =
      returnRequest

    const itemsToReturn = items.filter((item) => item.quantity > 0)

    if (itemsToReturn.length === 0) {
      // Error: no item selected
      return
    }

    const validatedItems = itemsToReturn.filter(isItemToReturn)

    if (itemsToReturn.length !== validatedItems.length) {
      // Error: missing reason or condition
      // Set items with error
      return
    }

    for (const field of Object.keys(customerProfileData)) {
      if (!customerProfileData[field]) {
        // Error: missing customer profile data
        return
      }
    }

    for (const fields of Object.keys(pickupReturnData)) {
      if (!pickupReturnData[fields]) {
        // Error: missing pickup return data
        return
      }
    }

    if (!pickupReturnData.addressType) {
      // error: missing address type
      return
    }

    const { addressType } = pickupReturnData

    const { refundPaymentMethod } = refundPaymentData ?? {}

    if (!refundPaymentData || !refundPaymentMethod) {
      // error: missing refund payment data
      return
    }

    if (refundPaymentMethod === 'bank') {
      if (!refundPaymentData.iban) {
        // error: missing iban
        return
      }

      if (refundPaymentData.accountHolderName) {
        // error: missing account holder name
        return
      }
    }

    setReturnRequestArgs({
      ...returnRequest,
      items: validatedItems,
      pickupReturnData: { ...pickupReturnData, addressType },
      refundPaymentData,
    })
  }

  return (
    <StoreSettingsPovider>
      <OrderToReturnProvider>
        <PageBlock className="ph0 mh0 pa0 pa0-ns">
          <PageHeader
            className="ph0 mh0 nl5"
            title={
              <FormattedMessage id="store/return-app.return-order-details.page-header.title" />
            }
            linkLabel={
              <FormattedMessage id="store/return-app.return-order-details.page-header.link" />
            }
            onLinkClick={() =>
              navigate({
                to: `#/my-returns/add`,
              })
            }
          />
          {page === 'form-details' ? (
            <ReturnDetails
              {...props}
              onPageChange={handlePageChange}
              onValidateFields={validateReturnFields}
            />
          ) : null}
          {page === 'submit-form' ? (
            <ConfirmAndSubmit
              onPageChange={handlePageChange}
              validatedReturnRequest={returnRequestArgs}
            />
          ) : null}
        </PageBlock>
      </OrderToReturnProvider>
    </StoreSettingsPovider>
  )
}
