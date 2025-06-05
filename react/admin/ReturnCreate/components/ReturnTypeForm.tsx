import React from 'react'
import { Dropdown } from 'vtex.styleguide'

interface ReturnTypeFormProps {
  returnAction: string
  reasonCode: string
  onReturnActionChange: (value: string) => void
  onReasonCodeChange: (value: string) => void
}

const TYPE_OPTIONS = [
  { value: 'RT', label: 'Return Only' },
  { value: 'CO', label: 'Credit Only' },
  { value: 'MF', label: 'Misc Refund' },
]

const TYPE_FILTERED_OPTIONS: Record<
  string,
  {
    returnCategoryOptions: Array<{ value: string; label: string }>
    reasonCodeOptions: Record<string, Array<{ value: string; label: string }>>
  }
> = {
  RT: {
    returnCategoryOptions: [
      { value: 'orderEntry', label: 'Order Entry related' },
      { value: 'customer', label: 'Customer related' },
      { value: 'item', label: 'Item or product related' },
      { value: 'delivery', label: 'Delivery related' },
      { value: 'warehouse', label: 'Warehouse related' },
      { value: 'unauthorized', label: 'DC Only - Unauthorized return' },
    ],
    reasonCodeOptions: {
      orderEntry: [
        { value: 'EE', label: 'EE – Item or Quantity was Entered Incorrectly' },
        { value: 'ES', label: 'ES – Wrong Shipping Address was Used' },
      ],
      customer: [
        {
          value: 'CN',
          label: 'CN – Customer Related* (listed as "No Longer Needs" online)*',
        },
        { value: 'CL', label: 'CL – Customer Does Not Want Item' },
        { value: 'CD', label: 'CD – Duplicate order - Customer Error' },
        { value: 'CW', label: 'CW – Customer ordered wrong item*' },
      ],
      item: [
        { value: 'ID', label: 'ID – Item/Product Related*' },
        {
          value: 'IC',
          label: 'IC – Description Does Not Match (from catalog or web)*',
        },
      ],
      delivery: [
        { value: 'DD', label: 'DD – Product was Delivered Damaged*' },
        { value: 'DO', label: 'DO – Entire order was Delivered Damaged' },
        { value: 'DL', label: 'DL – Delivered Product Late*' },
        { value: 'DX', label: 'DX – Customer did not order' },
      ],
      warehouse: [
        { value: 'WW', label: 'WW – Received Wrong Item*' },
        { value: 'WL', label: 'WL – Wrong Label on Box' },
        { value: 'WM', label: 'WM – Mis-Picked' },
        { value: 'WD', label: 'WD – Duplicate order – (Facility Error)' },
      ],
      unauthorized: [
        { value: 'UR', label: 'UR – DC Only - Unauthorized return' },
      ],
    },
  },
  CO: {
    returnCategoryOptions: [
      { value: 'orderEntry', label: 'Order Entry related' },
      { value: 'customer', label: 'Customer related' },
      { value: 'item', label: 'Item or product related' },
      { value: 'delivery', label: 'Delivery related' },
      { value: 'warehouse', label: 'Warehouse related' },
    ],
    reasonCodeOptions: {
      orderEntry: [
        { value: 'EE', label: 'EE – Item or Quantity was Entered Incorrectly' },
        { value: 'ES', label: 'ES – Wrong Shipping Address was Used' },
        { value: 'EC', label: 'EC – Billed Incorrectly' },
      ],
      customer: [
        { value: 'CA', label: 'CA - Amazon Return to Store (B2B Use Only)' },
        {
          value: 'CN',
          label: 'CN – Customer Related* (listed as "No Longer Needs" online)*',
        },
        { value: 'CC', label: 'CC – Acct CleanUp/Credit Rebill' },
        { value: 'CF', label: 'CF--Customer refused delivery' },
        { value: 'CS', label: 'CS - Customer Signed Disputed' },
      ],
      item: [
        { value: 'ID', label: 'ID – Item/Product Related*' },
        {
          value: 'IC',
          label: 'IC – Description Does Not Match (from catalog or web)*',
        },
      ],
      delivery: [
        { value: 'DD', label: 'DD – Product was Delivered Damaged*' },
        { value: 'DO', label: 'DO – Entire order was Delivered Damaged' },
        { value: 'DN', label: 'DN – Order/Case Not Delivered' },
        { value: 'DL', label: 'DL – Delivered Product Late*' },
        { value: 'DC', label: 'DC – Customer Not Available' },
        { value: 'DX', label: 'DX – Customer did not order' },
        { value: 'CS', label: 'CS-Customer Signed Disputed' },
      ],
      warehouse: [
        { value: 'WW', label: 'WW – Received Wrong Item*' },
        { value: 'WS', label: 'WS – Short Ship Split-Case/Repack' },
        { value: 'WF', label: 'WF – Short-shipment Full Case Item' },
        { value: 'WL', label: 'WL – Wrong Label on Box' },
        { value: 'WM', label: 'WM – Mis-Picked' },
        { value: 'WD', label: 'WD – Duplicate order – (Facility Error)' },
      ],
    },
  },
  MF: {
    returnCategoryOptions: [
      { value: 'orderEntry', label: 'Order Entry related' },
      { value: 'customer', label: 'Customer related' },
      { value: 'item', label: 'Item or product related' },
      { value: 'delivery', label: 'Delivery related' },
    ],
    reasonCodeOptions: {
      orderEntry: [
        { value: 'EE', label: 'EE – Item or Quantity was Entered Incorrectly' },
        { value: 'EP', label: 'EP – Special Pricing was Entered Incorrectly' },
      ],
      customer: [
        {
          value: 'CN',
          label: 'CN – Customer Related* (listed as "No Longer Needs" online)*',
        },
      ],
      item: [
        { value: 'ID', label: 'ID – Item/Product Related*' },
        {
          value: 'IC',
          label: 'IC – Description Does Not Match (from catalog or web)*',
        },
      ],
      delivery: [
        { value: 'DD', label: 'DD – Product was Delivered Damaged*' },
        { value: 'DO', label: 'DO – Entire order was Delivered Damaged' },
        { value: 'DF', label: 'DF - Service Failure' },
      ],
    },
  },
}

export const ReturnTypeForm: React.FC<ReturnTypeFormProps> = ({
  returnAction,
  reasonCode,
  onReturnActionChange,
  onReasonCodeChange,
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState('')

  const handleReturnActionChange = (_: any, value: string) => {
    onReturnActionChange(value)
    setSelectedCategory('')
    onReasonCodeChange('')
  }

  const handleCategoryChange = (_: any, value: string) => {
    setSelectedCategory(value)
    onReasonCodeChange('')
  }

  const filteredOptions = returnAction
    ? TYPE_FILTERED_OPTIONS[returnAction]
    : null

  return (
    <>
      <div className="mb5">
        <h3>Return Attributes</h3>
        <div className="mb5">
          <Dropdown
            label="Return Type"
            options={TYPE_OPTIONS}
            value={returnAction}
            onChange={handleReturnActionChange}
            required
          />
        </div>

        <div className="mb5">
          <Dropdown
            label="Return Category"
            options={filteredOptions?.returnCategoryOptions || []}
            value={selectedCategory}
            onChange={handleCategoryChange}
            disabled={!returnAction}
            required
          />
        </div>

        <div className="mb5">
          <Dropdown
            label="Return Reason Code"
            options={
              returnAction && filteredOptions
                ? filteredOptions.reasonCodeOptions[selectedCategory] || []
                : []
            }
            value={reasonCode}
            onChange={(_, value) => onReasonCodeChange(value)}
            disabled={!selectedCategory}
            required
          />
        </div>
      </div>
    </>
  )
}
