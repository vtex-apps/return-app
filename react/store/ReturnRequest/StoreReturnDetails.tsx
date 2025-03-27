import React from 'react'
import type { RouteComponentProps } from 'react-router'
import { PageBlock, PageHeader } from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { StoreReturnDetailsLoader } from './loaders/StoreReturnDetailsLoader'
import { ReturnDetailsProvider } from '../../common/provider/ReturnDetailsProvider'
import { useReturnDetails } from '../../common/hooks/useReturnDetails'
import { ItemDetailsList } from '../../common/components/ReturnDetails/ItemDetails/ItemDetailsList'
import { ReturnValues } from '../../common/components/ReturnDetails/ReturnValues/ReturnValues'
import { ContactDetails } from '../../common/components/ContactDetails'
import { PickupAddress } from '../../common/components/ReturnDetails/PickupAddress'
import { RefundMethodDetail } from '../../common/components/ReturnDetails/RefundMethodDetail'
import { StatusTimeline } from '../../common/components/ReturnDetails/StatusTimeline/StatusTimeline'
import { StatusHistory } from '../../common/components/ReturnDetails/StatusHistory'
import { OrderLink } from '../../common/components/ReturnDetails/OrderLink'
import { CurrentRequestStatus } from '../../common/components/ReturnDetails/CurrentRequestStatus'
import RequestCancellation from '../../common/components/ReturnDetails/RequestCancellation'
import { UpdateRequestStatusProvider } from '../../admin/provider/UpdateRequestStatusProvider'
import { AlertProvider } from '../../admin/provider/AlertProvider'

const CSS_HANDLES = ['contactPickupContainer'] as const

const StoreReturnDetails = () => {
  const { loading, error } = useReturnDetails()
  const { navigate } = useRuntime()
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className="return-detail__container">
      <PageBlock>
        <PageHeader
          title={
            <FormattedMessage id="store/return-app.return-request-details.page-header.title" />
          }
          linkLabel={
            <FormattedMessage id="store/return-app.return-request-details.page-header.link-label" />
          }
          onLinkClick={() => {
            navigate({
              to: '#/my-returns',
            })
          }}
        >
          <AlertProvider>
            <UpdateRequestStatusProvider>
              <RequestCancellation />
            </UpdateRequestStatusProvider>
          </AlertProvider>
        </PageHeader>
        <StoreReturnDetailsLoader data={{ loading, error }}>
          <CurrentRequestStatus />
          <OrderLink />
          <ItemDetailsList />
          <ReturnValues />
          <div
            className={`${handles.contactPickupContainer} flex-ns flex-wrap flex-row`}
          >
            <ContactDetails />
            <PickupAddress />
          </div>
          <RefundMethodDetail />
          <StatusTimeline />
          <StatusHistory />
        </StoreReturnDetailsLoader>
      </PageBlock>
    </div>
  )
}

export const StoreReturnDetailsContainer = (
  props: RouteComponentProps<{ id: string }>
) => {
  return (
    <ReturnDetailsProvider requestId={props.match.params.id}>
      <StoreReturnDetails />
    </ReturnDetailsProvider>
  )
}
