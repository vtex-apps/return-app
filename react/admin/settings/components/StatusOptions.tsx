import type { ChangeEvent } from 'react'
import React from 'react'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import { Toggle, Divider } from 'vtex.styleguide'

import { useSettings } from '../hooks/useSettings'

const statusOptions = [
  'enableStatusSelection',
] as const

const messages = defineMessages({
  'enableStatusSelection-label-true': {
    id: 'admin/return-app.settings.section.status-options.enable-other-option-selection.label-true',
  },
  'enableStatusSelection-label-false': {
    id: 'admin/return-app.settings.section.status-options.enable-other-option-selection.label-false',
  },
  'enableStatusSelection-description': {
    id: 'admin/return-app.settings.section.status-options.enable-other-option-selection.description',
  },
})

export const StatusOptions = () => {
  const { appSettings, actions } = useSettings()

  const intl = useIntl()

  const dispatch = actions?.dispatch

  const handleToggle = (e: ChangeEvent<HTMLInputElement>) => {
    const {  checked } = e.target
    
    dispatch({ type: 'updateStatus', payload: checked })
  }

  return (
    <section>
      <h3>
        <FormattedMessage id="admin/return-app.settings.section.status-options.header" />
      </h3>
      <div className="mb4 mh4">
        {statusOptions.map((option, i, self) => {
          return (
            <div className="mt4" key={option}>
              <Toggle
                name={option}
                semantic
                label={appSettings?.[option] ? intl.formatMessage(messages[`${option}-label-true`]) : intl.formatMessage(messages[`${option}-label-false`]) }
                helpText={intl.formatMessage(messages[`${option}-description`])}
                onChange={handleToggle}
                checked={appSettings?.[option]}
              />
              {i === self.length - 1 ? null : (
                <div className="mv4">
                  <Divider />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
