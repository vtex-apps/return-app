import type { FC } from 'react'
import React from 'react'
import { Layout, PageHeader, PageBlock } from 'vtex.styleguide'
import { useIntl, defineMessages } from 'react-intl'

import ReturnForm from './admin/ReturnForm'
import {useRuntime} from "vtex.render-runtime";

const messages = defineMessages({
    requests: {id: "navigation.labelRequests"},
    info: {id: "navigation.requestInfo"}
})

const ReturnDetails: FC = (props) => {
  const intl = useIntl()
    const { navigate } = useRuntime()

  return (
    <Layout fullWidth pageHeader={<PageHeader title={`${intl.formatMessage({id: messages.info.id})}`}
                                              linkLabel={intl.formatMessage({id: messages.requests.id})}
                                              onLinkClick={() => {
                                                  navigate({to: `/admin/app/returns/requests/`})
                                              }}/>}>
      <PageBlock variation="full">
        <ReturnForm data={props} intl={intl} />
      </PageBlock>
    </Layout>
  )
}

export default ReturnDetails
