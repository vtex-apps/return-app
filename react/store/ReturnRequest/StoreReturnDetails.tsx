import React from 'react'
import type { RouteComponentProps } from 'react-router'
import { PageBlock, PageHeader } from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'

import { StoreReturnDetailsLoader } from './loaders/StoreReturnDetailsLoader'
import { ReturnDetailsProvider } from '../../admin/provider/ReturnDetailsProvider'
import { useReturnDetails } from '../../admin/hooks/useReturnDetails'

const StoreReturnDetails = () => {
  const { data, loading, error } = useReturnDetails()
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
        <code>{JSON.stringify(data, null, 2)}</code>
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
