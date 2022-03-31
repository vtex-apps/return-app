import type { FC } from 'react'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Layout, PageBlock, PageHeader } from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'

import ReturnsTable from './ReturnsTable'

const ReturnsRequests: FC = () => {
  const { navigate } = useRuntime()

  return (
    <Layout
      fullWidth
      pageHeader={
        <PageHeader
          title={<FormattedMessage id="admin/return-app.navigation.label" />}
        />
      }
    >
      <PageBlock variation="full">
        <ReturnsTable navigate={navigate} />
      </PageBlock>
    </Layout>
  )
}

export default ReturnsRequests
