import React from 'react'
import { Route, Switch } from 'vtex.my-account-commons/Router'

import { StoreMyReturnsPageWrapper } from './store/StoreMyReturnsPage'
import { StoreMyReturnsDetailsWrapper } from './store/StoreMyReturnsDetails'
import { OrdersAvailableToRMA, CreateRMA } from './store/StoreMyReturnsAdd'

export const AppRouter = () => {
  return (
    <Switch>
      <Route exact path="/my-returns" component={StoreMyReturnsPageWrapper} />
      <Route
        exact
        path="/my-returns/details/:id"
        component={StoreMyReturnsDetailsWrapper}
      />
      <Route exact path="/my-returns/add" component={OrdersAvailableToRMA} />
      <Route exact path="/my-returns/add/:orderId" component={CreateRMA} />
    </Switch>
  )
}

export default AppRouter
