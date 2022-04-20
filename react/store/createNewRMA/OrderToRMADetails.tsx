import type { ApolloError } from 'apollo-client'
import React, { useEffect, useState } from 'react'
import { FormattedDate } from 'react-intl'
import { useQuery } from 'react-apollo'
import {
  Table,
  PageHeader,
  PageBlock,
  NumericStepper,
  Textarea,
  Input,
  Dropdown,
  Spinner,
} from 'vtex.styleguide'
import type { RouteComponentProps } from 'react-router'
import type {
  OrderToReturnSummary,
  QueryOrderToReturnSummaryArgs,
  OrderToReturnValidation,
  ReturnAppSettings,
} from 'vtex.return-app'

import ORDER_TO_RETURN_SUMMARY from './graphql/getOrderToReturnSummary.gql'
import RETURN_APP_SETTINGS from '../../admin/settings/graphql/getAppSettings.gql'
import { ORDER_TO_RETURN_VALIDATON } from '../utils/constants'

const { ORDER_NOT_INVOICED, OUT_OF_MAX_DAYS } = ORDER_TO_RETURN_VALIDATON

type ItemToReturn = {
  id: number
  quantity: number
  available: number
  isExcluded: boolean
  name: string
  imageUrl: string
}

function availableProductsToReturn(ordersToReturn) {
  const { invoicedItems, excludedItems, processedItems } = ordersToReturn

  // const processedItems = [
  //   { itemIndex: 0, quantity: 3 },
  //   { itemIndex: 1, quantity: 1 },
  //   { itemIndex: 2, quantity: 1 },
  //   { itemIndex: 2, quantity: 1 },
  //   { itemIndex: 2, quantity: 1 },
  // ]

  const filteredItemsToReturn: ItemToReturn[] = []

  invoicedItems.forEach(({ quantity, name, imageUrl, id }) => {
    const itemToReturn = {
      id,
      quantity,
      available: quantity,
      isExcluded: false,
      name,
      imageUrl,
    }

    filteredItemsToReturn.push(itemToReturn)
  })

  excludedItems.forEach((item) => {
    const { quantity, name, imageUrl, id } = invoicedItems[item.itemIndex]

    const itemToReturn = {
      id,
      quantity,
      available: 0,
      isExcluded: true,
      name,
      imageUrl,
    }

    filteredItemsToReturn[item.itemIndex] = itemToReturn
  })
  processedItems.forEach(({ itemIndex, quantity }) => {
    const { name, imageUrl, id } = invoicedItems[itemIndex]

    const availableQuantity =
      filteredItemsToReturn[itemIndex].available - quantity

    const itemToReturn = {
      id,
      quantity: filteredItemsToReturn[itemIndex].quantity,
      available: availableQuantity,
      isExcluded: false,
      name,
      imageUrl,
    }

    !filteredItemsToReturn[itemIndex].isExcluded
      ? (filteredItemsToReturn[itemIndex] = itemToReturn)
      : null
  })

  return filteredItemsToReturn
}

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
  const [formInputs, setFormInputs] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    locality: '',
    address: '',
    state: '',
    zip: '',
    extraComment: '',
  })

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

  const handleInputChange = (event) => {
    const { target } = event
    const value = target.type === 'checkbox' ? target.checked : target.value
    const { name } = target

    setFormInputs((prevState) => ({ ...prevState, [name]: value }))
  }

  if (error) {
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
        errorString = 'You don`t have access to this order'
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
      {loading ? (
        <div className="flex justify-center items-center-s">
          <Spinner />
        </div>
      ) : (
        <Table
          fullWidth
          emptyStateLabel={(errorCase && !data) ?? errorCase}
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
      )}
      <div className="flex-ns flex-wrap flex-row mt5">
        <div className="flex-ns flex-wrap flex-auto flex-column pa4">
          <p>Contact details</p>
          <div className="mb4">
            <Input
              name="name"
              placeholder="Name"
              onChange={handleInputChange}
              value={formInputs.name}
            />
          </div>
          <div className="mb4">
            <Input
              disabled
              name="email"
              placeholder="email"
              onChange={handleInputChange}
              value={formInputs.email}
            />
          </div>
          <div className="mb4">
            <Input
              name="phone"
              placeholder="Phone"
              onChange={handleInputChange}
              value={formInputs.phone}
            />
          </div>
        </div>

        <div className="flex-ns flex-wrap flex-auto flex-column pa4">
          <p>Pickup Address</p>
          <div className="mb4">
            <Input
              name="address"
              placeholder="address"
              onChange={handleInputChange}
              value={formInputs.address}
            />
          </div>
          <div className="mb4">
            <Input
              name="locality"
              placeholder="Locality"
              onChange={handleInputChange}
              value={formInputs.locality}
            />
          </div>
          <div className="mb4">
            <Input
              name="state"
              placeholder="State"
              onChange={handleInputChange}
              value={formInputs.state}
            />
          </div>
          <div className="mb4">
            <Input
              name="zip"
              placeholder="zip"
              onChange={handleInputChange}
              value={formInputs.zip}
            />
          </div>
          <div className="mb4">
            <Input
              name="country"
              placeholder="Country"
              onChange={handleInputChange}
              value={formInputs.country}
            />
          </div>
        </div>
        <div className="mt4 ph4">
          <p>Extra comment</p>
          <div>
            <Textarea
              name="extraComment"
              resize="none"
              onChange={handleInputChange}
              maxLength="250"
              value={formInputs.extraComment}
            />
          </div>
        </div>
      </div>
    </PageBlock>
  )
}
