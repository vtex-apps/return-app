import React from 'react'
import { Route, Switch } from 'vtex.my-account-commons/Router'

import { StoreMyReturnsPageWrapper } from './store/StoreMyReturnsPage'
import { StoreMyReturnsDetailsWrapper } from './store/StoreMyReturnsDetails'
import { StoreMyReturnsPageAddWrapper } from './store/StoreMyReturnsPageAdd'

const MockPage = () => <div>Mock Page</div>

export const AppRouter = () => {
  return (
    <Switch>
      <Route exact path="/my-returns" component={StoreMyReturnsPageWrapper} />
      <Route
        exact
        path="/my-returns/details/:id"
        component={StoreMyReturnsDetailsWrapper}
      />
      <Route
        exact
        path="/my-returns/add"
        component={StoreMyReturnsPageAddWrapper}
      />
      <Route exact path="/my-returns/add/:orderId" component={MockPage} />
    </Switch>
  )
}

export default AppRouter
