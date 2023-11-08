import React from 'react'
import { Button } from 'vtex.styleguide'
import { ContentWrapper } from 'vtex.my-account-commons'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'

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
  const {
    hints: { phone },
  } = useRuntime()

  const { formatMessage } = useIntl()
  const { returnRequestData } = useReturnRequestList()
  const { loading } = returnRequestData

  const headerContent = (
    <div className={`${phone ? 'mt4' : 'mt2'}`}>
      <Button
        variation="primary"
        size="small"
        disabled={loading}
        href="#/my-returns/add"
      >
        <FormattedMessage id="return-app.return-request-list.page-header.cta" />
      </Button>
    </div>
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
      {() => <ListTable />}
    </ContentWrapper>
  )
}
