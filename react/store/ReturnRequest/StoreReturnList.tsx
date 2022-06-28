import React from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { Button, PageBlock } from 'vtex.styleguide'
import { ContentWrapper } from 'vtex.my-account-commons'
import { FormattedMessage } from 'react-intl'

import ListTable from '../../common/components/returnList/ListTable'
import { useReturnRequestList } from '../../hooks/useReturnRequestList'

export const StoreReturnList = () => {
  const { navigate } = useRuntime()

  const { returnRequestData } = useReturnRequestList()
  const { loading } = returnRequestData

  const handleNewRequest = () => {
    navigate({ to: '#/my-returns/add' })
  }

  const headerContent = (
    <Button
      variation="primary"
      size="small"
      isLoading={loading}
      onClick={() => handleNewRequest()}
    >
      <FormattedMessage id="store/return-app.return-request-list.page-header.cta" />
    </Button>
  )

  return (
    <ContentWrapper
      namespace="return-app"
      titleId="store/return-app.return-request-list.page-header.title"
      backButton={{
        path: '/',
        titleId: 'store/return-app.return-request-list.page-header.goBack',
      }}
      headerContent={headerContent}
    >
      {() => (
        <PageBlock variation="full">
          <ListTable />
        </PageBlock>
      )}
    </ContentWrapper>
  )
}
