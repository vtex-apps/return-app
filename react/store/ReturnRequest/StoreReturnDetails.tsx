import React from 'react'
import type { RouteComponentProps } from 'react-router'
import { PageBlock, PageHeader } from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'

import { useReturnRequestDetails } from '../../hooks/useReturnRequestDetails'
import { StoreReturnDetailsLoader } from './loaders/StoreReturnDetailsLoader'

export const StoreReturnDetails = (
  props: RouteComponentProps<{ id: string }>
) => {
  const {
    returnDetailsData: { data, loading, error },
  } = useReturnRequestDetails(props.match.params.id)

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
