import type { FC } from 'react'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'

import ReturnsDetails from './ReturnsDetails'

const headerConfig = {
  namespace: 'vtex-account__returns-list',
  title: <FormattedMessage id="returns.link" />,
  backButton: {
    titleId: 'returns.link',
    path: '/my-returns',
  },
}

export const StoreMyReturnsDetailsWrapper: FC = (props: any) => {
  const { production, binding } = useRuntime()

  return (
    <ReturnsDetails
      {...props}
      headerConfig={headerConfig}
      production={production}
      binding={binding}
    />
  )
}
