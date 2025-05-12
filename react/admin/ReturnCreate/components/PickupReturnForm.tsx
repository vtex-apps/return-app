import React from 'react'
import { Dropdown, Input } from 'vtex.styleguide'

import type { PickupReturnData } from '../types/ReturnRequestForm'

interface ShippingData {
  shippingMethod?: string
  locationCde?: string
}

interface PickupReturnFormProps {
  data: PickupReturnData
  shippingData: ShippingData
  onChange: (field: string, value: string) => void
  onShippingChange: (field: string, value: string) => void
}

export const PickupReturnForm: React.FC<PickupReturnFormProps> = ({
  data,
  shippingData,
  onChange,
  onShippingChange,
}) => {
  const shippingMethodOptions = [
    { value: 'shippingLabel', label: 'Shipping Label' },
    { value: 'pickup', label: 'Pickup' },
  ]

  return (
    <div className="mb5">
      <h3>Address Information</h3>
      <div className="mb5">
        <Input
          label="Address"
          value={data.address}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange('address', e.target.value)
          }
          required
        />
      </div>

      <div className="mb5">
        <Input
          label="City"
          value={data.city}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange('city', e.target.value)
          }
          required
        />
      </div>

      <div className="mb5">
        <Input
          label="State"
          value={data.state}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange('state', e.target.value)
          }
          required
        />
      </div>

      <div className="mb5">
        <Input
          label="Country"
          value={data.country}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange('country', e.target.value)
          }
          required
        />
      </div>

      <div className="mb5">
        <Input
          label="ZIP Code"
          value={data.zipCode}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange('zipCode', e.target.value)
          }
          required
        />
      </div>
      <div className="mb5">
        <Dropdown
          label="Shipping Method"
          options={shippingMethodOptions}
          value={shippingData.shippingMethod}
          onChange={(_, value) => onShippingChange('shippingMethod', value)}
          required
        />
      </div>
    </div>
  )
}
