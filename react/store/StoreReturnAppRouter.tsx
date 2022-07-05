import React from 'react'
import { Route, Switch } from 'vtex.my-account-commons/Router'

import {
  StoreReturnList,
  StoreReturnDetailsContainer,
} from './StoreMyReturnsPage'
import {
  OrderListContainer,
  CreateReturnRequestContainer,
} from './StoreMyReturnsAdd'

export const AppRouter = () => {
  return (
    <Switch>
      <Route exact path="/my-returns" component={StoreReturnList} />
      <Route
        exact
        path="/my-returns/details/:id"
        component={StoreReturnDetailsContainer}
      />
      <Route exact path="/my-returns/add" component={OrderListContainer} />
      <Route
        exact
        path="/my-returns/add/:orderId"
        component={CreateReturnRequestContainer}
      />
    </Switch>
  )
}

export default AppRouter
