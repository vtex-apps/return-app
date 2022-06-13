import React, { useState } from 'react'
import {
  Layout,
  PageHeader,
  PageBlock,
  Spinner,
  EmptyState,
} from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'

import { UpdateRequestStatus } from './components/UpdateRequestStatus'
import { useReturnDetails } from '../hooks/useReturnDetails'
import { VerifyItemsPage } from './components/VerifyItems/VerifyItemsPage'
import { ContactDetails } from './components/ContactDetails'
import { PickupAddress } from './components/PickupAddress'

type Pages = 'return-details' | 'verify-items'

export const ReturnDetailsContainer = () => {
  const [detailsPage, setDetailsPage] = useState<Pages>('return-details')
  const { data, error, loading } = useReturnDetails()

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
        {error ? (
          <EmptyState
            title={
              <FormattedMessage id="admin/return-app.return-request-details.error.title" />
            }
          >
            <FormattedMessage id="admin/return-app.return-request-details.error.description" />
          </EmptyState>
        ) : loading ? (
          <Spinner />
        ) : !data?.returnRequestDetails ? null : (
          <>
            {detailsPage !== 'return-details' ? null : (
              <>
                <div className="flex-ns flex-wrap flex-row">
                  <ContactDetails />
                  <PickupAddress />
                </div>

                <div>Status {data.returnRequestDetails.status}</div>
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
        )}
      </PageBlock>
    </Layout>
  )
}
