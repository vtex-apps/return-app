import type { FC } from 'react'
import React, { Fragment } from 'react'
import { Route } from 'vtex.my-account-commons/Router'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'

import useAxiosInstance from './hooks/useAxiosModule'
import ReturnsPage from './store/MyReturnsPage'

const headerConfig = {
  namespace: 'vtex-account__returns-list',
  title: <FormattedMessage id="returns.link" />,
  headerContent: (
    <Button variation="primary" block size="small" href="#/my-returns/add">
      <FormattedMessage id="returns.addReturn" />
    </Button>
  ),
}

const StoreMyReturnsPageWrapper: FC = (props: any) => {
  const fetchApi = useAxiosInstance()
  const { production, binding } = useRuntime()

  return (
    <ReturnsPage
      {...props}
      headerConfig={headerConfig}
      fetchApi={fetchApi}
      production={production}
      binding={binding}
    />
  )
}

const StoreMyReturnsPage = () => (
  <Fragment>
    <Route exact path="/my-returns" component={StoreMyReturnsPageWrapper} />
  </Fragment>
)

export default StoreMyReturnsPage
