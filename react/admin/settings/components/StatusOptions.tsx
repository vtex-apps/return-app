import type { ChangeEvent } from 'react'
import React from 'react'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import { Toggle, Divider } from 'vtex.styleguide'

import { useSettings } from '../hooks/useSettings'

const generalOptions = [
  'enableStatusSelection',
] as const

const messages = defineMessages({
  'enableStatusSelection-label': {
    id: 'admin/return-app.settings.section.status-options.enable-other-option-selection.label',
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
    const { name, checked } = e.target

    const selectedOption = appSettings?.options ?? {}
    const updatedSelection = { ...selectedOption, [name]: checked }

    dispatch({ type: 'updateOptions', payload: updatedSelection })
  }

  return (
    <section>
      <h3>
        <FormattedMessage id="admin/return-app.settings.section.status-options.header" />
      </h3>
      <div className="mb4 mh4">
        {generalOptions.map((option, i, self) => {
          return (
            <div className="mt4" key={option}>
              <Toggle
                name={option}
                semantic
                label={intl.formatMessage(messages[`${option}-label`])}
                helpText={intl.formatMessage(messages[`${option}-description`])}
                onChange={handleToggle}
                checked={appSettings?.options?.[option]}
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
