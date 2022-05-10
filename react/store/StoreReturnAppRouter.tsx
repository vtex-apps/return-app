import React from 'react'
import { Route, Switch } from 'vtex.my-account-commons/Router'

import { StoreReturnList, StoreReturnDetails } from './StoreMyReturnsPage'
import { OrderListContainer, ReturnDetailsContainer } from './StoreMyReturnsAdd'

export const AppRouter = () => {
  return (
    <Switch>
      <Route exact path="/my-returns" component={StoreReturnList} />
      <Route
        exact
        path="/my-returns/details/:id"
        component={StoreReturnDetails}
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
