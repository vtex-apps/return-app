import React, { useState } from 'react'
import { Table, NumericStepper } from 'vtex.styleguide'
import { FormattedMessage, FormattedDate, useIntl } from 'react-intl'

import { RenderReasonDropdown } from './RenderReasonDropdown'
import { RenderConditionDropdown } from './RenderConditionDropdown'

interface Props {
  errorLabel: string
  loading: boolean
  order: any
  orderId: string
  creationDate?: string
}

export const ItemsList = ({
  errorLabel,
  loading,
  order,
  orderId,
  creationDate,
}: Props) => {
  const [selectedQuantity, setSelectedQuantity] = useState({})
  const [reason, setReason] = useState({})
  const [condition, setCondition] = useState({})
  const { formatMessage } = useIntl()

  const handleQuantity = (id: number, e) => {
    setSelectedQuantity((prevState) => ({
      ...prevState,
      [id]: e.value,
    }))
  }

  const handleReason = (id: number, value: string) => {
    setReason((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }

  const handleCondition = (id: number, value: string) => {
    setCondition((prevState) => ({
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

  return (
    <Table
      emptyStateLabel={errorLabel}
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
          label: formatMessage({
            id: 'store/return-app.return-order-details.page-header.creation-date',
          }),
          value: !creationDate ? null : (
            <FormattedDate
              value={creationDate}
              day="numeric"
              month="long"
              year="numeric"
            />
          ),
        },
      ]}
    />
  )
}
