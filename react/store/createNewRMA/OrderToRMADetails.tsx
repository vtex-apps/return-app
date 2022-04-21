import type { ApolloError } from 'apollo-client'
import React, { useEffect, useState } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { FormattedDate, FormattedMessage } from 'react-intl'
import { useQuery } from 'react-apollo'
import { Table, PageHeader, PageBlock, NumericStepper } from 'vtex.styleguide'
import type { RouteComponentProps } from 'react-router'
import type {
  OrderToReturnSummary,
  QueryOrderToReturnSummaryArgs,
  OrderToReturnValidation,
  ReturnAppSettings,
} from 'vtex.return-app'

import ORDER_TO_RETURN_SUMMARY from './graphql/getOrderToReturnSummary.gql'
import RETURN_APP_SETTINGS from './graphql/getAppSettings.gql'
import { ORDER_TO_RETURN_VALIDATON } from '../utils/constants'
import { availableProductsToReturn } from '../utils/filterProductsToReturn'
import { RenderConditionDropdown } from './components/RenderConditionDropdown'
import { RenderReasonDropdown } from './components/RenderReasonDropdown'

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

export const OrderToRMADetails = (
  props: RouteComponentProps<{ orderId: string }>
) => {
  const {
    match: {
      params: { orderId },
    },
  } = props

  const { navigate } = useRuntime()

  const [order, setOrder] = useState<ItemToReturn[]>([])
  const [selectedQuantity, setSelectedQuantity] = useState({})
  const [condition, setCondition] = useState({})
  const [reason, setReason] = useState({})
  const [errorCase, setErrorCase] = useState('')

  const { data, loading, error } = useQuery<
    { orderToReturnSummary: OrderToReturnSummary },
    QueryOrderToReturnSummaryArgs
  >(ORDER_TO_RETURN_SUMMARY, {
    variables: { orderId },
    skip: !orderId,
  })

  const {
    data: settings,
    loading: loadingSettings,
    error: errorSettings,
  } = useQuery<{
    returnAppSettings: ReturnAppSettings
  }>(RETURN_APP_SETTINGS)

  // eslint-disable-next-line no-console
  console.log(settings, loadingSettings, errorSettings)

  useEffect(() => {
    if (data) {
      const orderToReturnOutput = availableProductsToReturn(
        data.orderToReturnSummary
      )

      setOrder(orderToReturnOutput)
    }
  }, [data])

  const handleQuantity = (id: number, e) => {
    setSelectedQuantity((prevState) => ({
      ...prevState,
      [id]: e.value,
    }))
  }

  const handleCondition = (id: number, value: string) => {
    setCondition((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }

  const handleReason = (id: number, value: string) => {
    setReason((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }

  const tableSchema = {
    properties: {
      product: {
        title: (
          <FormattedMessage id="store/return-app.return-order-details.table-header.product" />
        ),
        width: 350,
        cellRenderer: function renderProduct({ rowData }) {
          // eslint-disable-next-line no-console
          // console.log(cellData.updateCellMeasurements(0))

          return (
            <section style={{ display: 'flex' }}>
              <img src={`${rowData.imageUrl}`} alt="Name" />
              <div
                style={{
                  marginLeft: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <p style={{ margin: '0px' }}>{rowData.name}</p>
                {rowData.isExcluded ? (
                  <p style={{ margin: '3px' }}>
                    <FormattedMessage id="store/return-app.return-order-details.table-paragraph.exluded-category" />
                  </p>
                ) : null}
              </div>
            </section>
          )
        },
      },
      quantity: {
        title: (
          <FormattedMessage id="store/return-app.return-order-details.table-header.quantity" />
        ),
        cellRenderer: function quantity({ rowData }) {
          // eslint-disable-next-line no-console
          return <p>{rowData.quantity}</p>
        },
      },
      availableToReturn: {
        title: (
          <FormattedMessage id="store/return-app.return-order-details.table-header.available-to-return" />
        ),
        width: 250,
        cellRenderer: function availableToReturn({ rowData }) {
          return <p>{rowData.available}</p>
        },
      },
      quantityAvailable: {
        title: (
          <FormattedMessage id="store/return-app.return-order-details.table-header.quantity-available-to-return" />
        ),
        width: 250,
        cellRenderer: function availableToReturn({ rowData }) {
          return (
            <div>
              <NumericStepper
                size="small"
                minValue={0}
                maxValue={`${rowData.available}`}
                value={selectedQuantity[rowData.id]}
                onChange={(e) => {
                  handleQuantity(rowData.id, e)
                }}
              />
            </div>
          )
        },
      },
      reason: {
        title: (
          <FormattedMessage id="store/return-app.return-order-details.table-header.reason" />
        ),
        cellRenderer: function reasonDropdown({ rowData }) {
          return (
            <RenderReasonDropdown
              id={rowData.id}
              settings={settings}
              isExcluded={rowData.isExcluded}
              handleReason={handleReason}
              reason={reason}
            />
          )
        },
      },
      condition: {
        title: (
          <FormattedMessage id="store/return-app.return-order-details.table-header.condition" />
        ),
        cellRenderer: function conditionDropdown({ rowData }) {
          // eslint-disable-next-line no-console
          return (
            <RenderConditionDropdown
              handleCondition={handleCondition}
              condition={condition}
              id={rowData.id}
            />
          )
        },
      },
    },
  }

  if (error && !errorCase.length) {
    const errorCode = getErrorCode(error)
    let errorString = ''

    switch (errorCode) {
      case ORDER_NOT_INVOICED:
        errorString = 'The order is not invoiced'
        break

      case OUT_OF_MAX_DAYS:
        errorString = 'The order exceeds the maximum return period'
        break

      case 'E_HTTP_404':
        errorString = 'Order not found'
        break

      case 'FORBIDDEN':
        errorString = 'You don´t have access to this order'
        break

      default:
        errorString = 'Something failed, please try again.'
    }

    setErrorCase(errorString)
  }

  // eslint-disable-next-line no-console
  console.log({ data, loading, error })

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
      <Table
        emptyStateLabel={errorCase}
        loading={loading}
        fullWidth
        schema={tableSchema}
        items={order}
        totalizers={[
          {
            label: 'OrderId',
            value: `${orderId}`,
          },
          {
            label: 'Creation Date',
            value: (
              <FormattedDate
                value={`${data?.orderToReturnSummary.creationDate}`}
                day="numeric"
                month="long"
                year="numeric"
              />
            ),
          },
        ]}
      />
    </PageBlock>
  )
}
