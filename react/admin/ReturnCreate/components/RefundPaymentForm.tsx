import React from 'react'
import { Dropdown, Input } from 'vtex.styleguide'

import type { RefundPaymentData } from '../types/ReturnRequestForm'

interface RefundPaymentFormProps {
  data: RefundPaymentData
  onChange: (field: string, value: string) => void
}

export const RefundPaymentForm: React.FC<RefundPaymentFormProps> = ({
  data,
  onChange,
}) => {
  const paymentMethodOptions = [
    { value: 'sameAsPurchase', label: 'Same as Purchase' },
    { value: 'giftCard', label: 'Gift Card' },
  ]

  return (
    <div className="mb5">
      <h3>Refund Payment Information</h3>
      <div className="mb5">
        <Dropdown
          placeholder="Refund Payment Method"
          options={paymentMethodOptions}
          value={data.refundPaymentMethod}
          onChange={(_, value) => onChange('refundPaymentMethod', value)}
        />
      </div>

      {data.refundPaymentMethod === 'bank' && (
        <>
          <div className="mb5">
            <Input
              label="IBAN"
              value={data.iban}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange('iban', e.target.value)
              }
            />
          </div>
          <div className="mb5">
            <Input
              label="Account Holder Name"
              value={data.accountHolderName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange('accountHolderName', e.target.value)
              }
            />
          </div>
        </>
      )}
    </div>
  )
}
