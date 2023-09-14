import React from 'react'
import { Layout, PageHeader, PageBlock } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import ListTable from '../../common/components/returnList/ListTable'

export const AdminReturnList = () => {
  return (
    <Layout
      fullWidth
      pageHeader={
        <PageHeader
          title={
            <FormattedMessage id="admin/return-app.return-request-list.page-header.title" />
          }
          subtitle={
            <FormattedMessage id="admin/return-app.return-request-list.page-header.subTitle" />
          }
        />
      }
    >
      <PageBlock variation="full" fit="fill">
        <ListTable />
      </PageBlock>
    </Layout>
  )
}
