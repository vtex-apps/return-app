import React from 'react'
import type { RouteComponentProps } from 'react-router'
import { PageBlock, PageHeader } from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'

import { StoreReturnDetailsLoader } from './loaders/StoreReturnDetailsLoader'
import { ReturnDetailsProvider } from '../../common/provider/ReturnDetailsProvider'
import { useReturnDetails } from '../../common/hooks/useReturnDetails'
import { ItemDetailsList } from '../../common/components/ReturnDetails/ItemDetails/ItemDetailsList'
import { ReturnValues } from '../../common/components/ReturnDetails/ReturnValues/ReturnValues'
import { ContactDetails } from '../../common/components/ContactDetails'
import { PickupAddress } from '../../common/components/ReturnDetails/PickupAddress'
import { RefundMethodDetail } from '../../common/components/ReturnDetails/RefundMethodDetail'
import { StatusTimeline } from '../../common/components/ReturnDetails/StatusTimeline/StatusTimeline'

const StoreReturnDetails = () => {
  const { loading, error } = useReturnDetails()
  const { navigate } = useRuntime()

  return (
    <PageBlock className="ph0 mh0 pa0 pa0-ns">
      <PageHeader
        className="ph0 mh0 nl5"
        title="Return Details"
        linkLabel="Link Label"
        onLinkClick={() => {
          navigate({
            to: '#/my-returns',
          })
        }}
      />
      <StoreReturnDetailsLoader data={{ loading, error }}>
        <ItemDetailsList />
        <ReturnValues />
        <div className="flex-ns flex-wrap flex-row">
          <ContactDetails />
          <PickupAddress />
        </div>
        <RefundMethodDetail />
        <StatusTimeline />
      </StoreReturnDetailsLoader>
    </PageBlock>
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
