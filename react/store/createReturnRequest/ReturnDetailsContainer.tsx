import React, { useEffect, useState } from 'react'
import type { RouteComponentProps } from 'react-router'
import { useQuery } from 'react-apollo'
import type {
  OrderToReturnSummary,
  QueryOrderToReturnSummaryArgs,
} from 'vtex.return-app'
import { PageHeader, PageBlock } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'

import { StoreSettingsPovider } from '../provider/StoreSettingsProvider'
import { OrderToReturnProvider } from '../provider/OrderToReturnProvider'
import { ReturnDetails } from './components/ReturnDetails'
import { ConfirmAndSubmit } from './components/ConfirmAndSubmit'
import { useReturnRequest } from '../hooks/useReturnRequest'
import ORDER_TO_RETURN_SUMMARY from './graphql/getOrderToReturnSummary.gql'
import { formatItemsToReturn } from '../utils/formatItemsToReturn'
import { setInitialPickupAddress } from '../utils/setInitialPickupAddress'
import { useStoreSettings } from '../hooks/useStoreSettings'
import { ReturnDetailsLoader } from './components/loaders/ReturnDetailsLoader'

export type Page = 'form-details' | 'submit-form'

type RouteProps = RouteComponentProps<{ orderId: string }>

const createPageHeaderProps = (page: Page, navigate: any) => {
  if (page === 'submit-form') {
    return {
      title: (
        <FormattedMessage id="store/return-app.confirm-and-submit.page-header.title" />
      ),
    }
  }

  return {
    title: (
      <FormattedMessage id="store/return-app.return-order-details.page-header.title" />
    ),
    linkLabel: (
      <FormattedMessage id="store/return-app.return-order-details.page-header.title" />
    ),
    onLinkClick: () => {
      navigate({
        to: '#/my-returns/add',
      })
    },
  }
}

export const CreateReturnRequest = (props: RouteProps) => {
  const {
    match: {
      params: { orderId },
    },
  } = props

  const [page, setPage] = useState<Page>('form-details')
  const [items, setItemsToReturn] = useState<ItemToReturn[]>([])

  const {
    actions: { updateReturnRequest },
  } = useReturnRequest()

  const { data: storeSettings } = useStoreSettings()
  const { paymentOptions } = storeSettings ?? {}
  const { enablePaymentMethodSelection } = paymentOptions ?? {}

  const { navigate } = useRuntime()

  const { data, loading, error } = useQuery<
    { orderToReturnSummary: OrderToReturnSummary },
    QueryOrderToReturnSummaryArgs
  >(ORDER_TO_RETURN_SUMMARY, {
    variables: { orderId },
    skip: !orderId,
  })

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
        refundPaymentData: enablePaymentMethodSelection
          ? undefined
          : {
              refundPaymentMethod: 'sameAsPurchase',
            },
      },
    })
  }, [data, storeSettings, updateReturnRequest, enablePaymentMethodSelection])

  const handlePageChange = (selectedPage: Page) => {
    setPage(selectedPage)
  }

  return (
    <PageBlock className="ph0 mh0 pa0 pa0-ns">
      <PageHeader
        className="ph0 mh0 nl5"
        {...createPageHeaderProps(page, navigate)}
      />
      <ReturnDetailsLoader data={{ loading, error }}>
        {page === 'form-details' ? (
          <>
            <ReturnDetails
              {...props}
              onPageChange={handlePageChange}
              items={items}
              creationDate={data?.orderToReturnSummary?.creationDate}
              canRefundCard={
                data?.orderToReturnSummary?.paymentData.canRefundCard
              }
            />
          </>
        ) : null}
        {page === 'submit-form' ? (
          <ConfirmAndSubmit onPageChange={handlePageChange} items={items} />
        ) : null}
      </ReturnDetailsLoader>
    </PageBlock>
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