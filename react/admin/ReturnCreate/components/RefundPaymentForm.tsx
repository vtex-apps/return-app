import React from 'react'
import { Dropdown, Input, InputCurrency } from 'vtex.styleguide'

import type { RefundPaymentData } from '../types/ReturnRequestForm'

interface RefundAmountData {
  refundShippingValue?: number
  refundAdditionalValue?: number
}

interface CultureInfoData {
  currencyCode: string
  locale: string
}

interface RefundPaymentFormProps {
  data: RefundPaymentData
  refundData: RefundAmountData
  onChange: (field: string, value: string) => void
  onRefundChange: (field: string, value: string) => void
  cultureInfoData: CultureInfoData
}

export const RefundPaymentForm: React.FC<RefundPaymentFormProps> = ({
  data,
  refundData,
  onChange,
  onRefundChange,
  cultureInfoData,
}) => {
  const paymentMethodOptions = [
    { value: 'sameAsPurchase', label: 'Same as Purchase' },
    { value: 'giftCard', label: 'Gift Card' },
  ]

  return (
    <div className="mb5">
      <h3>Refund Information</h3>
      <div className="mb5">
        <Dropdown
          label="Refund Payment Method"
          options={paymentMethodOptions}
          value={data.refundPaymentMethod}
          onChange={(_, value) => onChange('refundPaymentMethod', value)}
          required
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
        <InputCurrency
          label="Shipping To Refund"
          value={refundData.refundShippingValue}
          currencyCode={cultureInfoData.currencyCode}
          locale={cultureInfoData.locale}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onRefundChange('refundShippingValue', e.target.value)
          }
        />
      </div>
      <div className="mb5">
        <InputCurrency
          label="Misc Refund Amount"
          value={refundData.refundAdditionalValue}
          currencyCode={cultureInfoData.currencyCode}
          locale={cultureInfoData.locale}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onRefundChange('refundAdditionalValue', e.target.value)
          }
        />
      </div>
    </div>
  )
}
