import type { FC } from 'react'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'

import ReturnsPage from './MyReturnsPage'

const headerConfig = {
  namespace: 'vtex-account__returns-list',
  title: <FormattedMessage id="returns.link" />,
  headerContent: (
    <Button variation="primary" block size="small" href="#/my-returns/add">
      <FormattedMessage id="returns.addReturn" />
    </Button>
  ),
}

export const StoreMyReturnsPageWrapper: FC = (props: any) => {
  const { production, binding } = useRuntime()

  return (
    <ReturnsPage
      {...props}
      headerConfig={headerConfig}
      production={production}
      binding={binding}
    />
  )
}
