import type { FC } from 'react'
import React, { Fragment } from 'react'
import { Route } from 'vtex.my-account-commons/Router'
import { FormattedMessage, useIntl } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import { useMutation } from 'react-apollo'
import { useCssHandles } from 'vtex.css-handles'

import useAxiosInstance from './hooks/useAxiosModule'
import ReturnsPageAdd from './store/MyReturnsPageAdd'
import CREATE_RETURN_REQUEST from './store/graphql/createReturnRequest.gql'

const headerConfig = {
  namespace: 'vtex-account__returns-list',
  title: <FormattedMessage id="returns.link" />,
  backButton: {
    titleId: 'returns.link',
    path: '/my-returns',
  },
}

const CSS_HANDLES = ['errorContainer']

const StoreMyReturnsPageAddWrapper: FC = (props: any) => {
  const axios = useAxiosInstance()
  const { production, binding, rootPath } = useRuntime()
  const intl = useIntl()
  const [createReturnRequest, { error, loading, called }] = useMutation<
    { returnRequestId: string },
    ReturnRequestMutationArgs
  >(CREATE_RETURN_REQUEST)

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
      fetchApi={axios}
      production={production}
      binding={binding}
      rootPath={rootPath}
      cssHandles={handles}
      intl={intl}
      creatReturnRequest={{
        sendRequest,
        data: { error, loading, called },
      }}
    />
  )
}

const StoreMyReturnsPageAdd = () => (
  <Fragment>
    <Route
      exact
      path="/my-returns/add"
      component={StoreMyReturnsPageAddWrapper}
    />
  </Fragment>
)

export default StoreMyReturnsPageAdd
