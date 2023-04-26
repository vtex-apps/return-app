import React, { useEffect, useState } from 'react'
import type { RouteComponentProps } from 'react-router'
import { useQuery } from 'react-apollo'
import type {
  OrderToReturnSummary,
  QueryOrderToReturnSummaryArgs,
} from '../../../typings/OrderToReturn'
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
import { OrderDetailsLoader } from './components/loaders/OrderDetailsLoader'

export type Page = 'form-details' | 'submit-form'

type RouteProps = RouteComponentProps<{ orderId: string }>

const createPageHeaderProps = (page: Page, navigate: any, isAdmin: boolean) => {
  if (page === 'submit-form') {
    return {
      title: (
        <FormattedMessage id="return-app.confirm-and-submit.page-header.title" />
      ),
    }
  }

  return {
    title: (
      <FormattedMessage id="return-app.return-order-details.page-header.title" />
    ),
    linkLabel: (
      <FormattedMessage id="return-app.return-order-details.page-header.link" />
    ),
    onLinkClick: () => {
      navigate({
        to: isAdmin ? '/admin/app/returns/orders/' : '#/my-returns/add',
      })
    },
  }
}

export const CreateReturnRequest = (props: any) => {
  const orderId = props?.match?.params?.orderId || props?.params?.orderId
  
  const isAdmin = props?.page ? true : false
  
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
    fetchPolicy: 'no-cache',
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

    const initialPickupAddress = setInitialPickupAddress(shippingData)

    updateReturnRequest({
      type: 'newReturnRequestState',
      payload: {
        orderId: id,
        customerProfileData: clientProfileData,
        pickupReturnData: initialPickupAddress,
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
    <div className="create-return-request__container">
      <PageBlock>
        <PageHeader {...createPageHeaderProps(page, navigate, isAdmin)} />
        <OrderDetailsLoader data={{ loading, error }}>
          {page === 'form-details' && data ? (
            <>
              <ReturnDetails
                {...props}
                onPageChange={handlePageChange}
                items={items}
                creationDate={data.orderToReturnSummary.creationDate}
                canRefundCard={
                  data?.orderToReturnSummary.paymentData.canRefundCard
                }
                shippingData={data.orderToReturnSummary.shippingData}
                isAdmin
              />
            </>
          ) : null}
          {page === 'submit-form' ? (
            <ConfirmAndSubmit onPageChange={handlePageChange} items={items} isAdmin={isAdmin} />
          ) : null}
        </OrderDetailsLoader>
      </PageBlock>
    </div>
  )
}

export const CreateReturnRequestContainer = (props: RouteProps) => {
  return (
    <StoreSettingsPovider>
      <OrderToReturnProvider>
        <CreateReturnRequest {...props} />
      </OrderToReturnProvider>
    </StoreSettingsPovider>
  )
}
