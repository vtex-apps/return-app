import React from 'react'
import { Dropdown } from 'vtex.styleguide'

interface ReturnTypeFormProps {
  returnType: string
  onReturnTypeChange: (value: string) => void
}

const TYPE_OPTIONS = [
  { value: 'standardReturn', label: 'Standard Return' },
  { value: 'creditReturn', label: 'Credit Return' },
  { value: 'notDeliveryReturn', label: 'Not Delivery Return' },
]

export const ReturnTypeForm: React.FC<ReturnTypeFormProps> = ({
  returnType,
  onReturnTypeChange,
}) => {
  const handleReturnTypeChange = (_: unknown, value: string) => {
    onReturnTypeChange(value)
  }

  return (
    <>
      <div className="mb5">
        <h3>Return Attributes</h3>
        <div className="mb5">
          <Dropdown
            label="Return Type"
            options={TYPE_OPTIONS}
            value={returnType}
            onChange={handleReturnTypeChange}
            required
          />
        </div>
      </div>
    </>
  )
}
