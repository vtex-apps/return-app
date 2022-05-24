import React from 'react'
import { FormattedDate, FormattedMessage } from 'react-intl'
import type { RouteComponentProps } from 'react-router'
import { useRuntime } from 'vtex.render-runtime'
import { PageHeader, PageBlock } from 'vtex.styleguide'

import { ContactDetails } from './ContactDetails'
import { AddressDetails } from './AddressDetails'
import { UserCommentDetails } from './UserCommentDetails'
import { useReturnRequest } from '../../hooks/useReturnRequest'
import { ItemsList } from './ItemsList'
import { PaymentMethods } from './PaymentMethods'
import { TermsAndConditions } from './TermsAndConditions'
import type { Page } from '../ReturnDetailsContainer'

interface Props {
  onPageChange: (page: Page) => void
  items: ItemToReturn[]
  creationDate?: string
  canRefundCard?: boolean
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
  } = props

  const {
    actions: { areFieldsValid },
  } = useReturnRequest()

  const { navigate } = useRuntime()

  const handleFieldsValidation = () => {
    if (areFieldsValid()) {
      onPageChange('submit-form')
      typeof window !== 'undefined' && window.scrollTo(0, 0)
    }
  }

  return (
    <PageBlock className="ph0 mh0 pa0 pa0-ns">
      <PageHeader
        className="ph0 mh0 nl5"
        title={
          <FormattedMessage id="store/return-app.return-order-details.page-header.title" />
        }
        linkLabel={
          <FormattedMessage id="store/return-app.return-order-details.page-header.link" />
        }
        onLinkClick={() =>
          navigate({
            to: `#/my-returns/add`,
          })
        }
      />
      <div className="mb5">
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
                  {creationDate ? (
                    <FormattedDate
                      value={creationDate}
                      day="numeric"
                      month="long"
                      year="numeric"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ItemsList items={items} />
      <div className="flex-ns flex-wrap flex-row mt5">
        <ContactDetails />
        <AddressDetails />
        <UserCommentDetails />
      </div>
      <PaymentMethods canRefundCard={canRefundCard} />
      <TermsAndConditions />
      <button onClick={handleFieldsValidation}>
        <FormattedMessage id="store/return-app.return-order-details.button.next" />
      </button>
    </PageBlock>
  )
}
