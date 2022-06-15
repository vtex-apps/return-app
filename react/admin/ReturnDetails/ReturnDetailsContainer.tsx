import React, { useState } from 'react'
import { Layout, PageHeader, PageBlock } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'

import { UpdateRequestStatus } from './components/UpdateRequestStatus'
import { useReturnDetails } from '../hooks/useReturnDetails'
import { VerifyItemsPage } from './components/VerifyItems/VerifyItemsPage'
import { ItemDetailsList } from './components/ItemDetails/ItemDetailsList'
import { ContactDetails } from './components/ContactDetails'
import { PickupAddress } from './components/PickupAddress'
import { AdminLoader } from '../AdminLoader'
import { ReturnValues } from './components/ReturnValues/ReturnValues'

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
              to: '/admin/returns/requests',
            })
          }}
        />
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
                <ItemDetailsList />
                <ReturnValues />
                <div className="flex-ns flex-wrap flex-row">
                  <ContactDetails />
                  <PickupAddress />
                </div>
                <UpdateRequestStatus
                  onViewVerifyItems={() =>
                    handleViewVerifyItems('verify-items')
                  }
                />
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
