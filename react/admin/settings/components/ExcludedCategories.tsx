import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Input, IconClear } from 'vtex.styleguide'

export const ExcludedCategories = () => {
  const intl = useIntl()

  return (
    <div className="flex flex-column mv6">
      <div className="flex flex-column w-100">
        <Input
          value=""
          size="regular"
          label={
            <FormattedMessage id="admin/return-app.settings.excluded-categories.label" />
          }
          placeholder={intl.formatMessage({
            id: 'admin/return-app.settings.search-categories.placeholder',
          })}
          errorMessage=""
          suffix={
            <button
              type="button"
              className="transparent-button"
              onClick={() => {}}
            >
              <IconClear />
            </button>
          }
        />
      </div>
    </div>
  )
}
