import React from 'react'
import {
  Layout,
  PageHeader,
  PageBlock,
  Spinner,
  EmptyState,
} from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'

import { useReturnRequestDetails } from '../../hooks/useReturnRequestDetails'
import { UpdateRequestStatus } from './components/UpdateRequestStatus'

interface CustomRouteProps {
  params: {
    id: string
  }
}

export const ReturnDetailsContainer = (props: CustomRouteProps) => {
  const { returnDetailsData } = useReturnRequestDetails(props.params.id)
  const { loading, error, data } = returnDetailsData

  const { navigate } = useRuntime()

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
        {!error ? null : (
          <EmptyState
            title={
              <FormattedMessage id="admin/return-app.return-request-details.error.title" />
            }
          >
            <FormattedMessage id="admin/return-app.return-request-details.error.description" />
          </EmptyState>
        )}
        {loading ? <Spinner /> : null}
        {!data?.returnRequestDetails ? null : (
          <>
            <div>Status {data.returnRequestDetails.status}</div>
            <UpdateRequestStatus />
          </>
        )}
      </PageBlock>
    </Layout>
  )
}
