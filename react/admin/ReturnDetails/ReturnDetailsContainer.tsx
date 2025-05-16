import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import { Layout, PageBlock, PageHeader } from 'vtex.styleguide'

import { ContactDetails } from '../../common/components/ContactDetails'
import { AdditionalInfo } from '../../common/components/ReturnDetails/AdditionalInfo'
import { CurrentRequestStatus } from '../../common/components/ReturnDetails/CurrentRequestStatus'
import { ItemDetailsList } from '../../common/components/ReturnDetails/ItemDetails/ItemDetailsList'
import { OrderLink } from '../../common/components/ReturnDetails/OrderLink'
import { PickupAddress } from '../../common/components/ReturnDetails/PickupAddress'
import { RefundMethodDetail } from '../../common/components/ReturnDetails/RefundMethodDetail'
import RequestCancellation from '../../common/components/ReturnDetails/RequestCancellation'
import { ReturnValues } from '../../common/components/ReturnDetails/ReturnValues/ReturnValues'
import { StatusHistory } from '../../common/components/ReturnDetails/StatusHistory'
import { StatusTimeline } from '../../common/components/ReturnDetails/StatusTimeline/StatusTimeline'
import { useReturnDetails } from '../../common/hooks/useReturnDetails'
import { AdminLoader } from '../AdminLoader'
import { UpdateRequestStatus } from './components/UpdateRequestStatus'
import { VerifyItemsPage } from './components/VerifyItems/VerifyItemsPage'

type Pages = 'return-details' | 'verify-items'

export const ReturnDetailsContainer = () => {
  const [detailsPage, setDetailsPage] = useState<Pages>('return-details')
  const returnDetails = useReturnDetails()

  const { navigate } = useRuntime()

  const handleViewVerifyItems = (page: Pages) => {
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
          <RequestCancellation />
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
                  <div className="flex-ns flex-wrap flex-auto flex-column">
                    <ContactDetails />
                    <AdditionalInfo />
                  </div>
                  <div className="flex-ns flex-wrap flex-auto flex-column">
                    <PickupAddress />
                    <RefundMethodDetail />
                  </div>
                </div>
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
