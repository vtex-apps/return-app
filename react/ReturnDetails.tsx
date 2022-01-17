import type { FC } from 'react'
import React from 'react'
import { Layout, PageHeader, PageBlock } from 'vtex.styleguide'
import { useIntl, defineMessages } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'

import ReturnForm from './admin/ReturnForm'
import useAxiosInstance from './hooks/useAxiosModule'

const messages = defineMessages({
  requests: { id: 'navigation.labelRequests' },
  info: { id: 'navigation.requestInfo' },
})

const ReturnDetails: FC = (props) => {
  const intl = useIntl()
  const { navigate, binding, production } = useRuntime()
  const axios = useAxiosInstance()

  return (
    <Layout
      fullWidth
      pageHeader={
        <PageHeader
          title={`${intl.formatMessage({ id: messages.info.id })}`}
          linkLabel={intl.formatMessage({ id: messages.requests.id })}
          onLinkClick={() => {
            navigate({ to: `/admin/app/returns/requests/` })
          }}
        />
      }
    >
      <PageBlock variation="full">
        <ReturnForm
          data={props}
          intl={intl}
          fetchApi={axios}
          binding={binding}
          production={production}
        />
      </PageBlock>
    </Layout>
  )
}

export default ReturnDetails
