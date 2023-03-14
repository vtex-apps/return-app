import React from 'react'
import { Layout, PageHeader, PageBlock } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import ListTableSettings from '../../common/components/returnListSettings/ListTableSettings'

export const AdminSettingReturnList = () => {
  return (
    <Layout
      fullWidth
      pageHeader={
        <PageHeader
          title={
            <FormattedMessage id="admin/return-app.sellers-settings-list.page-header.title" />
          }
          subtitle={
            <FormattedMessage id="admin/return-app.sellers-settings-list.page-header.subTitle" />
          }
        />
      }
    >
      <PageBlock variation="full" fit="fill">
        <ListTableSettings />
      </PageBlock>
    </Layout>
  )
}
