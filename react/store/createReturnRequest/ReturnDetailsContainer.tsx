import React, { useEffect, useState } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { PageHeader, PageBlock } from 'vtex.styleguide'
import type { RouteComponentProps } from 'react-router'
import { defineMessages, FormattedMessage } from 'react-intl'
import { useQuery } from 'react-apollo'
import type {
  OrderToReturnSummary,
  OrderToReturnValidation,
  QueryOrderToReturnSummaryArgs,
} from 'vtex.return-app'
import type { ApolloError } from 'apollo-client'

import { StoreSettingsPovider } from '../provider/StoreSettingsProvider'
import { OrderToReturnProvider } from '../provider/OrderToReturnProvider'
import { ReturnDetails } from './components/ReturnDetails'
import { ConfirmAndSubmit } from './components/ConfirmAndSubmit'
import { useReturnRequest } from '../hooks/useReturnRequest'
import ORDER_TO_RETURN_SUMMARY from './graphql/getOrderToReturnSummary.gql'
import { ORDER_TO_RETURN_VALIDATON } from '../utils/constants'
import { formatItemsToReturn } from '../utils/formatItemsToReturn'
import { setInitialPickupAddress } from '../utils/setInitialPickupAddress'

export type Page = 'form-details' | 'submit-form'

type CodeError =
  | 'UNKNOWN_ERROR'
  | 'E_HTTP_404'
  | 'FORBIDDEN'
  | OrderToReturnValidation

const { ORDER_NOT_INVOICED, OUT_OF_MAX_DAYS } = ORDER_TO_RETURN_VALIDATON

const getErrorCode = (error: ApolloError): CodeError => {
  const { graphQLErrors } = error

  if (!graphQLErrors.length) {
    return 'UNKNOWN_ERROR'
  }

  const [{ extensions }] = graphQLErrors

  const { code } = extensions?.exception ?? {}

  const knownErrors = [
    ORDER_NOT_INVOICED,
    OUT_OF_MAX_DAYS,
    // order not found
    'E_HTTP_404',
    // userId on session doesn't match with userId on order profile
    'FORBIDDEN',
  ] as const

  const knownError = knownErrors.find((errorCode) => errorCode === code)

  return knownError ?? 'UNKNOWN_ERROR'
}

const errorMessages = defineMessages({
  [ORDER_NOT_INVOICED]: {
    id: 'store/return-app.return-order-details.error.order-not-invoiced',
  },
  [OUT_OF_MAX_DAYS]: {
    id: 'store/return-app.return-order-details.error.out-of-max-days',
  },
  E_HTTP_404: {
    id: 'store/return-app.return-order-details.error.order-not-found',
  },
  FORBIDDEN: {
    id: 'store/return-app.return-order-details.error.forbidden',
  },
  UNKNOWN_ERROR: {
    id: 'store/return-app.return-order-details.error.unknown',
  },
})

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
        items: itemsToReturn.map(({ orderItemIndex }) => ({
          orderItemIndex,
          quantity: 0,
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
