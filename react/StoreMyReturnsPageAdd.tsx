import type { FC } from 'react'
import React, { Fragment } from 'react'
import { Route } from 'vtex.my-account-commons/Router'
import { FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'

import useAxiosInstance from './hooks/useAxiosModule'
import ReturnsPageAdd from './store/MyReturnsPageAdd'

const headerConfig = {
  namespace: 'vtex-account__returns-list',
  title: <FormattedMessage id="returns.link" />,
  backButton: {
    titleId: 'returns.link',
    path: '/my-returns',
  },
}

const StoreMyReturnsPageAddWrapper: FC = (props: any) => {
  const axios = useAxiosInstance()
  const { production, binding } = useRuntime()

  return (
    <ReturnsPageAdd
      {...props}
      headerConfig={headerConfig}
      fetchApi={axios}
      production={production}
      binding={binding}
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
