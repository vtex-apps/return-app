import React, { useEffect, useState } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { PageHeader, PageBlock } from 'vtex.styleguide'
import type { RouteComponentProps } from 'react-router'
import { FormattedMessage } from 'react-intl'
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

  const { navigate } = useRuntime()
  const {
    actions: { updateReturnRequest },
  } = useReturnRequest()

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
    if (!data) {
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
        items: itemsToReturn.map(({ orderItemIndex, name, imageUrl }) => ({
          orderItemIndex,
          quantity: 0,
          name,
          imageUrl,
        })),
      },
    })
  }, [data, updateReturnRequest])

  const handlePageChange = (selectedPage: Page) => {
    setPage(selectedPage)
  }

  return (
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
          items={items}
          creationDate={data?.orderToReturnSummary?.creationDate}
          canRefundCard={data?.orderToReturnSummary?.paymentData.canRefundCard}
        />
      ) : null}
      {page === 'submit-form' ? (
        <ConfirmAndSubmit onPageChange={handlePageChange} />
      ) : null}
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
