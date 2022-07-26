import type { FC, ReactElement } from 'react'
import React from 'react'
import { FormattedMessage } from 'react-intl'

interface RenderProps {
  name: ReactElement | string
  path: string
}

interface Props {
  render: (paths: RenderProps[]) => ReactElement
}

const StoreMyReturnsLink: FC<Props> = ({ render }) => {
  return render([
    {
      name: <FormattedMessage id="store/return-app.link" />,
      path: '/my-returns',
    },
  ])
}

export default StoreMyReturnsLink
