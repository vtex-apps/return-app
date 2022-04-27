import type { ApolloError } from 'apollo-client'
import React, { useEffect, useState } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import {
  defineMessages,
  FormattedDate,
  FormattedMessage,
  useIntl,
} from 'react-intl'
import { useQuery } from 'react-apollo'
import { PageHeader, PageBlock } from 'vtex.styleguide'
import type { RouteComponentProps } from 'react-router'
import type {
  OrderToReturnSummary,
  QueryOrderToReturnSummaryArgs,
  OrderToReturnValidation,
} from 'vtex.return-app'

import ORDER_TO_RETURN_SUMMARY from './graphql/getOrderToReturnSummary.gql'
import { ORDER_TO_RETURN_VALIDATON } from '../utils/constants'
import { formatItemsToReturn } from '../utils/formatItemsToReturn'
import { ContactDetails } from './components/ContactDetails'
import { AddressDetails } from './components/AddressDetails'
import { UserCommentDetails } from './components/UserCommentDetails'
import { StoreSettingsPovider } from '../provider/StoreSettingsProvider'
import { OrderToReturnProvider } from '../provider/OrderToReturnProvider'
import { useReturnRequest } from '../hooks/useReturnRequest'
import { setInitialPickupAddress } from '../utils/setInitialPickupAddress'
import { ItemsList } from './components/ItemsList'

const { ORDER_NOT_INVOICED, OUT_OF_MAX_DAYS } = ORDER_TO_RETURN_VALIDATON

type CodeError =
  | 'UNKNOWN_ERROR'
  | 'E_HTTP_404'
  | 'FORBIDDEN'
  | OrderToReturnValidation

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

export const OrderToRMADetails = (
  props: RouteComponentProps<{ orderId: string }>
) => {
  const {
    match: {
      params: { orderId },
    },
  } = props

  const { navigate } = useRuntime()

  const [items, setItemsToReturn] = useState<ItemToReturn[]>([])
  const [errorCase, setErrorCase] = useState('')

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
      <div className="mb5">
        <div className="w-100 flex flex-row-ns ba br3 b--muted-4 flex-column">
          <div className="flex flex-column pa4 b--muted-4 flex-auto bb bb-0-ns br-ns">
            <div>
              <div className="c-muted-2 f6">OrderId</div>
              <div className="w-100 mt2">
                <div className="f4 fw5 c-on-base">{orderId}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-column pa4 b--muted-4 flex-auto bb bb-0-ns br-ns">
            <div>
              <div className="c-muted-2 f6">
                <FormattedMessage id="store/return-app.return-order-details.page-header.creation-date" />
              </div>
              <div className="w-100 mt2">
                <div className="f4 fw5 c-on-base">
                  {data?.orderToReturnSummary.creationDate ? (
                    <FormattedDate
                      value={data.orderToReturnSummary.creationDate}
                      day="numeric"
                      month="long"
                      year="numeric"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ItemsList
        items={items}
        orderId={orderId}
        creationDate={data?.orderToReturnSummary.creationDate}
      />
      <div className="flex-ns flex-wrap flex-row mt5">
        <ContactDetails />
        <AddressDetails />
        <UserCommentDetails />
      </div>
    </PageBlock>
  )
}

export const OrderDetails = (
  props: RouteComponentProps<{ orderId: string }>
) => {
  return (
    <StoreSettingsPovider>
      <OrderToReturnProvider>
        <OrderToRMADetails {...props} />
      </OrderToReturnProvider>
    </StoreSettingsPovider>
  )
}
