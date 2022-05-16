import React, { useEffect, useState } from 'react'
import type { RouteComponentProps } from 'react-router'
import { useQuery } from 'react-apollo'
import type {
  OrderToReturnSummary,
  QueryOrderToReturnSummaryArgs,
} from 'vtex.return-app'

import { StoreSettingsPovider } from '../provider/StoreSettingsProvider'
import { OrderToReturnProvider } from '../provider/OrderToReturnProvider'
import { ReturnDetails } from './components/ReturnDetails'
import { ConfirmAndSubmit } from './components/ConfirmAndSubmit'
import { useReturnRequest } from '../hooks/useReturnRequest'
import ORDER_TO_RETURN_SUMMARY from './graphql/getOrderToReturnSummary.gql'
import { formatItemsToReturn } from '../utils/formatItemsToReturn'
import { setInitialPickupAddress } from '../utils/setInitialPickupAddress'
import { getErrorCode, errorMessages } from '../utils/getErrorCode'
import { useStoreSettings } from '../hooks/useStoreSettings'

export type Page = 'form-details' | 'submit-form'

type RouteProps = RouteComponentProps<{ orderId: string }>

export const CreateReturnRequest = (props: RouteProps) => {
  const {
    match: {
      params: { orderId },
    },
  } = props

  const [page, setPage] = useState<Page>('form-details')
  const [items, setItemsToReturn] = useState<ItemToReturn[]>([])
  const [errorCase, setErrorCase] = useState('')

  const {
    actions: { updateReturnRequest },
  } = useReturnRequest()

  const { data: storeSettings } = useStoreSettings()
  const { paymentOptions } = storeSettings ?? {}
  const { enablePaymentMethodSelection } = paymentOptions ?? {}

  const { data, loading } = useQuery<
    { orderToReturnSummary: OrderToReturnSummary },
    QueryOrderToReturnSummaryArgs
  >(ORDER_TO_RETURN_SUMMARY, {
    variables: { orderId },
    skip: !orderId,
    onError: (error) => setErrorCase(getErrorCode(error)),
  })

  // Use this loading label to create a loading state for the whole component
  // Use the errorCase to create a error handler for the whole component (use errorMessages )
  // eslint-disable-next-line no-console
  console.log({ loading, errorCase, errorMessages })

  useEffect(() => {
    if (!data || !storeSettings) {
      return
    }

    const { orderToReturnSummary } = data
    const { orderId: id } = orderToReturnSummary

    const itemsToReturn = formatItemsToReturn(orderToReturnSummary)

    setItemsToReturn(itemsToReturn)

    const { clientProfileData, shippingData } = orderToReturnSummary

    updateReturnRequest({
      type: 'newReturnRequestState',
      payload: {
        orderId: id,
        customerProfileData: clientProfileData,
        pickupReturnData: setInitialPickupAddress(shippingData),
        items: itemsToReturn.map(({ orderItemIndex }) => ({
          orderItemIndex,
          quantity: 0,
        })),
        refundPaymentData: {
          refundPaymentMethod: 'sameAsPurchase',
        },
        ...(enablePaymentMethodSelection
          ? null
          : {
              refundPaymentData: {
                refundPaymentMethod: 'sameAsPurchase',
              },
            }),
      },
    })
  }, [data, storeSettings, updateReturnRequest, enablePaymentMethodSelection])

  const handlePageChange = (selectedPage: Page) => {
    setPage(selectedPage)
  }

  return (
    <>
      {page === 'form-details' ? (
        <ReturnDetails
          {...props}
          onPageChange={handlePageChange}
          items={items}
          creationDate={data?.orderToReturnSummary?.creationDate}
          canRefundCard={data?.orderToReturnSummary?.paymentData.canRefundCard}
        />
      ) : null}
      {page === 'submit-form' ? (
        <ConfirmAndSubmit onPageChange={handlePageChange} items={items} />
      ) : null}
    </>
  )
}

export const ReturnDetailsContainer = (props: RouteProps) => {
  return (
    <OrderToReturnProvider>
      <StoreSettingsPovider>
        <CreateReturnRequest {...props} />
      </StoreSettingsPovider>
    </OrderToReturnProvider>
  )
}
