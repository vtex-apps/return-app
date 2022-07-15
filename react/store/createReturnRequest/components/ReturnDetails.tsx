import React from 'react'
import { FormattedDate, FormattedMessage } from 'react-intl'
import type { RouteComponentProps } from 'react-router'
import type { ShippingData } from 'vtex.return-app'
import { Divider } from 'vtex.styleguide'

import { ContactDetails } from './ContactDetails'
import { AddressDetails } from './AddressDetails'
import { UserCommentDetails } from './UserCommentDetails'
import { useReturnRequest } from '../../hooks/useReturnRequest'
import { ItemsList } from './ItemsList'
import { PaymentMethods } from './PaymentMethods'
import { TermsAndConditions } from './TermsAndConditions'
import type { Page } from '../CreateReturnRequest'

interface Props {
  onPageChange: (page: Page) => void
  items: ItemToReturn[]
  creationDate: string
  canRefundCard: boolean
  shippingData: ShippingData
}

export const ReturnDetails = (
  props: RouteComponentProps<{ orderId: string }> & Props
) => {
  const {
    match: {
      params: { orderId },
    },
    onPageChange,
    items,
    creationDate,
    canRefundCard,
    shippingData,
  } = props

  const {
    actions: { areFieldsValid },
  } = useReturnRequest()

  const handleFieldsValidation = () => {
    if (areFieldsValid()) {
      onPageChange('submit-form')
      typeof window !== 'undefined' && window.scrollTo(0, 0)
    }
  }

  return (
    <>
      <div className="mb5">
        <div className="w-100 mt4">
          <div className="f4 mb5 fw5">
            <FormattedMessage id="store/return-app.return-order-details.section-products" />
          </div>
        </div>
        <div className="w-100 flex flex-row-ns ba br3 b--muted-4 flex-column">
          <div className="flex flex-column pa4 b--muted-4 flex-auto bb bb-0-ns br-ns">
            <div>
              <div className="c-muted-2 f6">
                <FormattedMessage id="store/return-app.return-order-details.page-header.order-id" />
              </div>
              <div className="w-100 mt2">
                <div className="f4 fw5 c-on-base">{orderId}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-column pa4 b--muted-4 flex-auto bb bb-0-ns br-ns">
            <div>
              <div className="c-muted-2 f6">
                <FormattedMessage id="store/return-app.return-order-details.page-header.creation-date" />
              </div>
              <div className="w-100 mt2">
                <div className="f4 fw5 c-on-base">
                  <FormattedDate
                    value={creationDate}
                    day="numeric"
                    month="long"
                    year="numeric"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="t-body lh-copy c-muted-1 mb3 ml3 w-two-thirds-ns w-100">
        <FormattedMessage id="store/return-app.return-order-details.page-header.subtitle" />
      </div>
      <ItemsList items={items} creationDate={creationDate} />
      <div className="mv8">
        <Divider orientation="horizontal" />
      </div>
      <div className="w-100">
        <div className="f4 fw5">
          <FormattedMessage id="store/return-app.return-order-details.section-details" />
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
          <FormattedMessage id="store/return-app.return-order-details.section-payment" />
        </div>
      </div>
      <PaymentMethods canRefundCard={canRefundCard} />
      <TermsAndConditions />
      <button onClick={handleFieldsValidation}>
        <FormattedMessage id="store/return-app.return-order-details.button.next" />
      </button>
    </>
  )
}
