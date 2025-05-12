import React from 'react'
import { Dropdown, Input } from 'vtex.styleguide'

import type { RefundPaymentData } from '../types/ReturnRequestForm'

interface RefundAmountData {
  refundShippingValue?: number
  refundAdditionalValue?: number
}

interface RefundPaymentFormProps {
  data: RefundPaymentData
  refundData: RefundAmountData
  onChange: (field: string, value: string) => void
  onRefundChange: (field: string, value: string) => void
}

export const RefundPaymentForm: React.FC<RefundPaymentFormProps> = ({
  data,
  refundData,
  onChange,
  onRefundChange,
}) => {
  const paymentMethodOptions = [
    { value: 'sameAsPurchase', label: 'Same as Purchase' },
    { value: 'giftCard', label: 'Gift Card' },
  ]

  return (
    <div className="mb5">
      <h3>Additional Information</h3>
      <div className="mb5">
        <Dropdown
          label="Refund Payment Method"
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

      <div className="mb5">
        <Input
          label="Shipping Refund"
          value={refundData.refundShippingValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onRefundChange('refundShippingValue', e.target.value)
          }
        />
      </div>
      <div className="mb5">
        <Input
          label="Additional Refund"
          value={refundData.refundAdditionalValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onRefundChange('refundAdditionalValue', e.target.value)
          }
        />
      </div>
    </div>
  )
}
