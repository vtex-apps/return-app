import type { FC } from 'react'
import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import { useMutation } from 'react-apollo'
import { useCssHandles } from 'vtex.css-handles'

import ReturnsPageAdd from './MyReturnsPageAdd'
import CREATE_RETURN_REQUEST from './graphql/createReturnRequest.gql'

const headerConfig = {
  namespace: 'vtex-account__returns-list',
  title: <FormattedMessage id="returns.link" />,
  backButton: {
    titleId: 'returns.link',
    path: '/my-returns',
  },
}

const CSS_HANDLES = ['errorContainer']

export const StoreMyReturnsPageAddWrapper: FC = (props: any) => {
  const { production, binding, rootPath } = useRuntime()
  const intl = useIntl()
  const [
    createReturnRequest,
    {
      error: errorSubmittingRequest,
      loading: submittingRequest,
      called: requestSubmitted,
    },
  ] = useMutation<{ returnRequestId: string }, ReturnRequestMutationArgs>(
    CREATE_RETURN_REQUEST
  )

  const handles = useCssHandles(CSS_HANDLES)

  const sendRequest = ({
    returnRequest,
    returnedItems,
  }: ReturnRequestMutationArgs) =>
    createReturnRequest({
      variables: {
        returnRequest,
        returnedItems,
      },
    })

  return (
    <ReturnsPageAdd
      {...props}
      headerConfig={headerConfig}
      production={production}
      binding={binding}
      rootPath={rootPath}
      cssHandles={handles}
      intl={intl}
      creatReturnRequest={{
        sendRequest,
        data: { errorSubmittingRequest, submittingRequest, requestSubmitted },
      }}
    />
  )
}
