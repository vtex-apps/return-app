import React, { useState } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { PageHeader, PageBlock } from 'vtex.styleguide'
import type { RouteComponentProps } from 'react-router'
import { FormattedMessage } from 'react-intl'

import { StoreSettingsPovider } from '../provider/StoreSettingsProvider'
import { OrderToReturnProvider } from '../provider/OrderToReturnProvider'
import { ReturnDetails } from './components/ReturnDetails'
import { ConfirmAndSubmit } from './components/ConfirmAndSubmit'

export type Page = 'form-details' | 'submit-form'

export const ReturnDetailsContainer = (
  props: RouteComponentProps<{ orderId: string }>
) => {
  const [page, setPage] = useState<Page>('form-details')

  const { navigate } = useRuntime()

  const handlePageChange = (selectedPage: Page) => {
    setPage(selectedPage)
  }

  return (
    <StoreSettingsPovider>
      <OrderToReturnProvider>
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
          {page === 'form-details' ? (
            <ReturnDetails {...props} onPageChange={handlePageChange} />
          ) : null}
          {page === 'submit-form' ? (
            <ConfirmAndSubmit onPageChange={handlePageChange} />
          ) : null}
        </PageBlock>
      </OrderToReturnProvider>
    </StoreSettingsPovider>
  )
}
