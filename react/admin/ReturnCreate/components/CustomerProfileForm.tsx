import React from 'react'
import { Input } from 'vtex.styleguide'

import type { Order } from '../types/Order'
import type { CustomerProfileData } from '../types/ReturnRequestForm'

interface CustomerProfileFormProps {
  data: CustomerProfileData
  onChange: (field: string, value: string) => void
  order: Order | null
}

export const CustomerProfileForm: React.FC<CustomerProfileFormProps> = ({
  data,
  onChange,
  order,
}) => {
  return (
    <div className="mb5">
      <h3>Customer Information</h3>
      <div className="mb5">
        <Input
          label="Customer Name"
          value={data.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange('name', e.target.value)
          }
          required
        />
      </div>

      <div className="mb5">
        <Input
          label="Customer Phone"
          value={data.phoneNumber}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange('phoneNumber', e.target.value)
          }
          required
        />
      </div>

      <div className="mb5">
        <Input
          label="Customer Email"
          value={data.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange('email', e.target.value)
          }
          disabled={!!order}
        />
      </div>
    </div>
  )
}
