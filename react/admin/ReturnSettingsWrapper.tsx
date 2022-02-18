import React from 'react'
import { Layout, PageHeader } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import ReturnsSettings from './ReturnsSettings'

const ReturnSettingsWrapper = (props: any) => {
  return (
    <Layout
      pageHeader={
        <PageHeader
          title={<FormattedMessage id="navigation.labelSettings" />}
        />
      }
    >
      <ReturnsSettings {...props} />
    </Layout>
  )
}

export default ReturnSettingsWrapper
