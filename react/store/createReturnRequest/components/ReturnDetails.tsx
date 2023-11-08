import React from 'react'
import { FormattedDate, FormattedMessage, FormattedNumber } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { Divider, Button } from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'

import type { ShippingData } from '../../../../typings/OrderToReturn'
import { ContactDetails } from './ContactDetails'
import { AddressDetails } from './AddressDetails'
import { UserCommentDetails } from './UserCommentDetails'
import { useReturnRequest } from '../../hooks/useReturnRequest'
import { ItemsList } from './ItemsList'
import { PaymentMethods } from './PaymentMethods'
import { TermsAndConditions } from './TermsAndConditions'
import type { Page } from '../CreateReturnRequest'

const CSS_HANDLES = [
  'returnDetailsContainer',
  'orderIdDetailsWrapper',
  'creationDateDetailsWrapper',
  'returnValuesContainer',
] as const

interface Props {
  onPageChange: (page: Page) => void
  items: ItemToReturn[]
  creationDate: string
  canRefundCard: boolean
  shippingData: ShippingData
}

export const ReturnDetails = (props: any & Props) => {
  const orderId = props?.match?.params?.orderId || props?.params?.orderId

  const {
    onPageChange,
    items,
    creationDate,
    canRefundCard,
    shippingData,
    availableAmountsToRefund,
  } = props

  const [isChecked, setIsChecked] = React.useState(false)

  const handles = useCssHandles(CSS_HANDLES)
  const {
    actions: { areFieldsValid },
  } = useReturnRequest()

  const {
    hints: { phone },
    culture: { currency },
  } = useRuntime()

  const handleFieldsValidation = () => {
    if (areFieldsValid()) {
      onPageChange('submit-form')
      typeof window !== 'undefined' && window.scrollTo(0, 0)
    }
  }

  return (
    <>
      <div className={`${handles.returnDetailsContainer} mb5`}>
        <div className="w-100 mt4">
          <div className="f4 mb5 fw5">
            <FormattedMessage id="return-app.return-order-details.section-products" />
          </div>
        </div>
        <div className="w-100 flex flex-row-ns ba br3 b--muted-4 flex-column">
          <div
            className={`${handles.orderIdDetailsWrapper} flex flex-column pa4 b--muted-4 flex-auto bb bb-0-ns br-ns`}
          >
            <div>
              <div className="c-muted-2 f6">
                <FormattedMessage id="return-app.return-order-details.page-header.order-id" />
              </div>
              <div className="w-100 mt2">
                <div className="f4 fw5 c-on-base">{orderId}</div>
              </div>
            </div>
          </div>
          <div
            className={`${handles.creationDateDetailsWrapper} flex flex-column pa4 b--muted-4 flex-auto bb bb-0-ns br-ns`}
          >
            <div>
              <div className="c-muted-2 f6">
                <FormattedMessage id="return-app.return-order-details.page-header.creation-date" />
              </div>
              <div className="w-100 mt2">
                <div className="f4 fw5 c-on-base">
                  <FormattedDate
                    value={creationDate}
                    day="2-digit"
                    month="2-digit"
                    year="numeric"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-100 mt4">
          <div className="f4 mb5 fw5">
            <FormattedMessage id="return-app.return-request-details.available-amounts.header" />
          </div>
        </div>
        <div className="w-100 flex flex-row-ns ba br3 b--muted-4 flex-column">
          <div
            className={`${handles.orderIdDetailsWrapper} flex flex-column pa4 b--muted-4 flex-auto bb bb-0-ns br-ns`}
          >
            <div>
              <div className="c-muted-2 f6">
                <FormattedMessage id="return-app.return-request-details.available-amounts.total-order" />
              </div>
              <div className="w-100 mt2">
                <div className="f4 fw5 c-on-base">
                  <FormattedNumber
                    value={
                      (availableAmountsToRefund.initialInvoicedAmount || 0) /
                      100
                    }
                    style="currency"
                    currency={currency}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            className={`${handles.creationDateDetailsWrapper} flex flex-column pa4 b--muted-4 flex-auto bb bb-0-ns br-ns`}
          >
            <div>
              <div className="c-muted-2 f6">
                <FormattedMessage id="return-app.return-request-details.available-amounts.remaining-amount" />
              </div>
              <div className="w-100 mt2">
                <div className="f4 fw5 c-on-base">
                  <div className="f4 fw5 c-on-base">
                    <FormattedNumber
                      value={
                        (availableAmountsToRefund.remainingRefundableAmount ||
                          0) / 100
                      }
                      style="currency"
                      currency={currency}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`${handles.creationDateDetailsWrapper} flex flex-column pa4 b--muted-4 flex-auto bb bb-0-ns br-ns`}
          >
            <div>
              <div className="c-muted-2 f6">
                <FormattedMessage id="return-app.return-request-details.available-amounts.amount-to-refund" />
              </div>
              <div className="w-100 mt2">
                <div className="f4 fw5 c-on-base">
                  <div className="f4 fw5 c-on-base">
                    <FormattedNumber
                      value={
                        (availableAmountsToRefund.amountToBeRefundedInProcess ||
                          0) / 100
                      }
                      style="currency"
                      currency={currency}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`${handles.creationDateDetailsWrapper} flex flex-column pa4 b--muted-4 flex-auto bb bb-0-ns br-ns`}
          >
            <div>
              <div className="c-muted-2 f6">
                <FormattedMessage id="return-app.return-request-details.available-amounts.total-refunded" />
              </div>
              <div className="w-100 mt2">
                <div className="f4 fw5 c-on-base">
                  <div className="f4 fw5 c-on-base">
                    <FormattedNumber
                      value={
                        (availableAmountsToRefund.totalRefunded || 0) / 100
                      }
                      style="currency"
                      currency={currency}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="t-body lh-copy c-muted-1 mb3 ml3 w-two-thirds-ns w-100">
        <FormattedMessage id="return-app.return-order-details.page-header.subtitle" />
      </div>
      <div className="overflow-scroll">
        <ItemsList items={items} creationDate={creationDate} />
      </div>
      <div className="mb8">
        <Divider orientation="horizontal" />
      </div>
      <div className="w-100">
        <div className="f4 fw5">
          <FormattedMessage id="return-app.return-order-details.section-details" />
        </div>
      </div>
      <div className="flex-ns flex-wrap flex-row">
        <ContactDetails />
        <AddressDetails shippingData={shippingData} />
        <UserCommentDetails />
      </div>
      <div className="mv8">
        <Divider orientation="horizontal" />
      </div>
      <div className="w-100">
        <div className="f4 fw5">
          <FormattedMessage id="return-app.return-order-details.section-payment" />
        </div>
      </div>
      <PaymentMethods canRefundCard={canRefundCard} />
      <TermsAndConditions setIsChecked={setIsChecked} />
      <div className="flex justify-center mt6">
        <Button
          onClick={handleFieldsValidation}
          block={phone}
          disabled={!isChecked}
        >
          <FormattedMessage id="return-app.return-order-details.button.next" />
        </Button>
      </div>
    </>
  )
}
