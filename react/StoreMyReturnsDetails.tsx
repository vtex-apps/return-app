import type { FC } from 'react'
import React from 'react'
import { Route } from 'vtex.my-account-commons/Router'
import { FormattedMessage } from 'react-intl'

import ReturnsDetails from './store/ReturnsDetails'
import useAxiosInstance from './hooks/useAxiosModule'

const headerConfig = {
  namespace: 'vtex-account__returns-list',
  title: <FormattedMessage id="returns.link" />,
  backButton: {
    titleId: 'returns.link',
    path: '/my-returns',
  },
}

const StoreMyReturnsDetailsWrapper: FC = (props: any) => {
  const fetchApi = useAxiosInstance()

  return (
    <ReturnsDetails
      {...props}
      headerConfig={headerConfig}
      fetchApi={fetchApi}
    />
  )
}

const StoreMyReturnsDetails = () => {
  return (
    <Route
      exact
      path="/my-returns/details/:id"
      component={StoreMyReturnsDetailsWrapper}
    />
  )
}

export default StoreMyReturnsDetails
