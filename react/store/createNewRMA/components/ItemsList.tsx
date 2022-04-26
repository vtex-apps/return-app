import React, { useState } from 'react'
import { Table, NumericStepper } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import { RenderConditionDropdown } from './RenderConditionDropdown'
import { ItemsDetails } from './ItemsDetails'

interface Props {
  errorLabel: string
  loading: boolean
  items: ItemToReturn[]
  orderId: string
  creationDate?: string
}

export const ItemsList = ({ errorLabel, loading, items }: Props) => {
  const [selectedQuantity, setSelectedQuantity] = useState({})
  const [condition, setCondition] = useState({})

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
          <FormattedMessage id="store/return-app.return-order-details.table-header.quantity-to-return" />
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
    <>
      <table className="w-100">
        <thead className="w-100 ph4 truncate overflow-x-hidden c-muted-2 f6">
          <tr className="w-100 truncate overflow-x-hidden">
            <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s">
              <FormattedMessage id="store/return-app.return-order-details.table-header.product" />
            </th>
            <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s">
              <FormattedMessage id="store/return-app.return-order-details.table-header.quantity" />
            </th>
            <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s">
              <FormattedMessage id="store/return-app.return-order-details.table-header.available-to-return" />
            </th>
            <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s">
              <FormattedMessage id="store/return-app.return-order-details.table-header.quantity-to-return" />
            </th>
            <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s">
              <FormattedMessage id="store/return-app.return-order-details.table-header.reason" />
            </th>
            <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s">
              <FormattedMessage id="store/return-app.return-order-details.table-header.condition" />
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <ItemsDetails key={item.id} {...item} />
          ))}
        </tbody>
      </table>
      <Table
        emptyStateLabel={errorLabel}
        loading={loading}
        fullWidth
        schema={tableSchema}
        items={items}
      />
    </>
  )
}
