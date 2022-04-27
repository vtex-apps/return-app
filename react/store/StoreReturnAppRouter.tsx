import React from 'react'
import { Route, Switch } from 'vtex.my-account-commons/Router'

import { StoreMyReturnsPageWrapper } from './StoreMyReturnsPage'
import { StoreMyReturnsDetailsWrapper } from './StoreMyReturnsDetails'
import { OrderListContainer, ReturnDetailsContainer } from './StoreMyReturnsAdd'

export const AppRouter = () => {
  return (
    <Switch>
      <Route exact path="/my-returns" component={StoreMyReturnsPageWrapper} />
      <Route
        exact
        path="/my-returns/details/:id"
        component={StoreMyReturnsDetailsWrapper}
      />
      <Route exact path="/my-returns/add" component={OrderListContainer} />
      <Route
        exact
        path="/my-returns/add/:orderId"
        component={ReturnDetailsContainer}
      />
    </Switch>
  )
}

export default AppRouter
