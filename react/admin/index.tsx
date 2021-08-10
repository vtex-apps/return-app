import type { FunctionComponent } from 'react'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Layout, PageBlock, PageHeader } from 'vtex.styleguide'

import ReturnsTable from './ReturnsTable'

const ReturnsRequests: FunctionComponent = () => {
  return (
    <Layout
      fullWidth
      pageHeader={
        <PageHeader title={<FormattedMessage id="navigation.label" />} />
      }
    >
      <PageBlock variation="full">
        <ReturnsTable />
      </PageBlock>
    </Layout>
  )
}

export default ReturnsRequests
