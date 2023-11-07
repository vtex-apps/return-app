import React, { useState } from 'react'
import { Layout, PageHeader, PageBlock } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'

import { UpdateRequestStatus } from './components/UpdateRequestStatus'
import { useReturnDetails } from '../../common/hooks/useReturnDetails'
import { VerifyItemsPage } from './components/VerifyItems/VerifyItemsPage'
import { ItemDetailsList } from '../../common/components/ReturnDetails/ItemDetails/ItemDetailsList'
import { ContactDetails } from '../../common/components/ContactDetails'
import { PickupAddress } from '../../common/components/ReturnDetails/PickupAddress'
import { RefundMethodDetail } from '../../common/components/ReturnDetails/RefundMethodDetail'
import { AdminLoader } from '../AdminLoader'
import { ReturnValues } from '../../common/components/ReturnDetails/ReturnValues/ReturnValues'
import { StatusTimeline } from '../../common/components/ReturnDetails/StatusTimeline/StatusTimeline'
import { StatusHistory } from '../../common/components/ReturnDetails/StatusHistory'
import { OrderLink } from '../../common/components/ReturnDetails/OrderLink'
import { CurrentRequestStatus } from '../../common/components/ReturnDetails/CurrentRequestStatus'
import RequestCancellation from '../../common/components/ReturnDetails/RequestCancellation'
import ApproveRequest from '../../common/components/ReturnDetails/ApproveRequest'

type Pages = 'return-details' | 'verify-items'

export const ReturnDetailsContainer = () => {
  const [detailsPage, setDetailsPage] = useState<Pages>('return-details')
  const [showButtons, setShowButtons] = useState(true)
  const returnDetails = useReturnDetails()

  const { navigate } = useRuntime()

  const handleViewVerifyItems = (page: Pages) => {
    setShowButtons(page === 'return-details')
    setDetailsPage(page)
  }

  return (
    <Layout
      fullWidth
      pageHeader={
        <PageHeader
          title={
            <FormattedMessage id="admin/return-app.return-request-details.page-header.title" />
          }
          linkLabel={
            <FormattedMessage id="admin/return-app.return-request-details.page-header.link-label" />
          }
          onLinkClick={() => {
            navigate({
              to: '/admin/app/returns/requests',
            })
          }}
        >
          {showButtons ? (
            <div className="flex-ns flex-wrap flex-row">
              <div style={{ marginRight: '1rem' }}>
                <RequestCancellation />
              </div>
              <ApproveRequest
                onViewVerifyItems={() => handleViewVerifyItems('verify-items')}
              />
            </div>
          ) : null}
        </PageHeader>
      }
    >
      <PageBlock variation="full" fit="fill">
        <AdminLoader
          {...returnDetails}
          errorMessages={{
            errorTitle: (
              <FormattedMessage id="admin/return-app.return-request-details.error.title" />
            ),
            errorDescription: (
              <FormattedMessage id="admin/return-app.return-request-details.error.description" />
            ),
          }}
        >
          <>
            {detailsPage !== 'return-details' ? null : (
              <>
                <CurrentRequestStatus />
                <OrderLink />
                <ItemDetailsList />
                <ReturnValues />
                <div className="flex-ns flex-wrap flex-row">
                  <ContactDetails />
                  <PickupAddress />
                </div>
                <RefundMethodDetail />
                <StatusTimeline />
                <UpdateRequestStatus
                  onViewVerifyItems={() =>
                    handleViewVerifyItems('verify-items')
                  }
                />
                <StatusHistory />
              </>
            )}
            {detailsPage !== 'verify-items' ? null : (
              <VerifyItemsPage
                onViewVerifyItems={() =>
                  handleViewVerifyItems('return-details')
                }
              />
            )}
          </>
        </AdminLoader>
      </PageBlock>
    </Layout>
  )
}
