import React from 'react'
import { Button, PageBlock } from 'vtex.styleguide'
import { ContentWrapper } from 'vtex.my-account-commons'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'

import ListTable from '../../common/components/returnList/ListTable'
import { useReturnRequestList } from '../../hooks/useReturnRequestList'

const messages = defineMessages({
  titleId: {
    id: 'store/return-app.return-request-list.page-header.title',
  },
  backButton: {
    id: 'store/return-app.return-request-list.page-header.goBack',
  },
})

export const StoreReturnList = () => {
  const { returnRequestData } = useReturnRequestList()
  const { formatMessage } = useIntl()
  const { loading } = returnRequestData

  const headerContent = (
    <Button
      variation="primary"
      size="small"
      disabled={loading}
      href="#/my-returns/add"
    >
      <FormattedMessage id="store/return-app.return-request-list.page-header.cta" />
    </Button>
  )

  return (
    <ContentWrapper
      namespace="return-app"
      titleId={formatMessage(messages.titleId)}
      backButton={{
        path: '/',
        titleId: formatMessage(messages.backButton),
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
