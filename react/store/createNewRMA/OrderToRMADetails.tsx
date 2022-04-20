import type { ApolloError } from 'apollo-client'
import React, { useEffect, useState } from 'react'
import { FormattedDate } from 'react-intl'
import { useQuery } from 'react-apollo'
import {
  Table,
  PageHeader,
  PageBlock,
  NumericStepper,
  Dropdown,
} from 'vtex.styleguide'
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

  const renderConditionDropdown = (id) => {
    const conditionOptions = [
      {
        value: 'New With Box',
        label: 'New With Box',
      },
      {
        value: 'New Without Box',
        label: 'New Without Box',
      },
      {
        value: 'Used With Box',
        label: 'Used With Box',
      },
      {
        value: 'Used Without Box',
        label: 'Used Without Box',
      },
    ]

    return (
      <div>
        <Dropdown
          label=""
          placeholder="Select Condition"
          size="small"
          options={conditionOptions}
          value={condition[id]}
          onChange={(e) => {
            handleCondition(id, e.target.value)
          }}
        />
      </div>
    )
  }

  const renderReasonDropdown = (id, isExcluded) => {
    const reasonOptions = [
      {
        value: 'reasonAccidentalOrder',
        label: 'reasonAccidentalOrder',
      },
      {
        value: 'reasonBetterPrice',
        label: 'reasonBetterPrice',
      },
      {
        value: 'reasonPerformance',
        label: 'reasonPerformance',
      },
      {
        value: 'reasonIncompatible',
        label: 'reasonIncompatible',
      },
      {
        value: 'reasonItemDamaged',
        label: 'reasonItemDamaged',
      },
      {
        value: 'reasonMissedDelivery',
        label: 'reasonMissedDelivery',
      },
      {
        value: 'reasonMissingParts',
        label: 'reasonMissingParts',
      },
      {
        value: 'reasonBoxDamaged',
        label: 'reasonBoxDamaged',
      },
      {
        value: 'reasonDifferentProduct',
        label: 'reasonDifferentProduct',
      },
      {
        value: 'reasonDefective',
        label: 'reasonDefective',
      },
      {
        value: 'reasonArrivedInAddition',
        label: 'reasonArrivedInAddition',
      },
      {
        value: 'reasonNoLongerNeeded',
        label: 'reasonNoLongerNeeded',
      },
      {
        value: 'reasonUnauthorizedPurchase',
        label: 'reasonUnauthorizedPurchase',
      },
      {
        value: 'reasonDifferentFromWebsite',
        label: 'reasonDifferentFromWebsite',
      },
    ]

    if (settings?.returnAppSettings.options?.enableOtherOptionSelection) {
      reasonOptions.push({
        value: 'Other reason',
        label: 'Other reason',
      })
    }

    return (
      <div>
        {isExcluded ? (
          <Dropdown
            disabled
            label=""
            placeholder="Select reason"
            size="small"
            options={reasonOptions}
            value={reason[id]}
            onChange={(e) => {
              handleReason(id, e.target.value)
            }}
          />
        ) : (
          <Dropdown
            label=""
            placeholder="Select reason"
            size="small"
            options={reasonOptions}
            value={reason[id]}
            onChange={(e) => {
              handleReason(id, e.target.value)
            }}
          />
        )}
      </div>
    )
  }

  const tableSchema = {
    properties: {
      product: {
        title: 'Product',
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
                    The product category is excluded from being returned
                  </p>
                ) : null}
              </div>
            </section>
          )
        },
      },
      quantity: {
        title: 'Quantity',
        cellRenderer: function quantity({ rowData }) {
          // eslint-disable-next-line no-console
          return <p>{rowData.quantity}</p>
        },
      },
      availableToReturn: {
        title: 'Available to Return',
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
        title: 'Reason',
        cellRenderer: function reasonDropdown({ rowData }) {
          // eslint-disable-next-line no-console
          return renderReasonDropdown(rowData.id, rowData.isExcluded)
        },
      },
      condition: {
        title: 'Condition',
        cellRenderer: function conditionDropdown({ rowData }) {
          // eslint-disable-next-line no-console
          return renderConditionDropdown(rowData.id)
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
        title="My Returns"
        linkLabel="Back to Orders"
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
