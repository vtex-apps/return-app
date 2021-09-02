import React from 'react'
import { Route } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'

import ReturnsPage from './store/MyReturnsPage'

const headerConfig = {
  namespace: 'vtex-account__returns-list',
  title: <FormattedMessage id="returns.link" />,
  headerContent: (
    <Button
      variation="primary"
      block
      size="small"
      href="/account#/my-returns/add"
    >
      <FormattedMessage id="returns.addReturn" />
    </Button>
  ),
}

const StoreMyReturnsPage = () => {
  return (
    <Route
      path="/my-returns"
      exact
      render={(props: any) => (
        <ReturnsPage {...props} headerConfig={headerConfig} />
      )}
    />
  )
}

export default StoreMyReturnsPage
