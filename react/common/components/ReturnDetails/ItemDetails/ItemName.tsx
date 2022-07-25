import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Tooltip, IconInfo } from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'

interface Props {
  name: string
  localizedName?: string | null
}

const ItemName = (props: Props) => {
  const { name, localizedName } = props

  const {
    route: { domain },
  } = useRuntime()

  const isAdmin = domain === 'admin'

  if (isAdmin) {
    return (
      <>
        {localizedName ? (
          <>
            <div className="flex items-center">
              <span>{name}</span>
              <Tooltip
                label={
                  <FormattedMessage id="admin/return-app.return-request-details.localized-product-name.tooltip" />
                }
              >
                <span className="pointer ml3 flex gray">
                  <IconInfo />
                </span>
              </Tooltip>
            </div>
            <span className="t-small c-muted-2 mt2">{localizedName}</span>
          </>
        ) : (
          <span>{name}</span>
        )}
      </>
    )
  }

  return <span>{localizedName ?? name}</span>
}

export default ItemName
