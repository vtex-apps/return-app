import type { ChangeEvent } from 'react'
import React from 'react'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import { Toggle, Divider } from 'vtex.styleguide'

import { useSettings } from '../hooks/useSettings'

const generalOptions = [
  'enableOtherOptionSelection',
  'enablePickupPoints',
  'enableProportionalShippingValue',
  'enableSelectItemCondition',
] as const

const messages = defineMessages({
  'enableOtherOptionSelection-label': {
    id: 'admin/return-app.settings.section.general-options.enable-other-option-selection.label',
  },
  'enableOtherOptionSelection-description': {
    id: 'admin/return-app.settings.section.general-options.enable-other-option-selection.description',
  },
  'enablePickupPoints-label': {
    id: 'admin/return-app.settings.section.general-options.enable-pickup-points.label',
  },
  'enablePickupPoints-description': {
    id: 'admin/return-app.settings.section.general-options.enable-pickup-points.description',
  },
  'enableProportionalShippingValue-label': {
    id: 'admin/return-app.settings.section.general-options.enable-proportional-shipping-value.label',
  },
  'enableProportionalShippingValue-description': {
    id: 'admin/return-app.settings.section.general-options.enable-proportional-shipping-value.description',
  },
  'enableSelectItemCondition-label': {
    id: 'admin/return-app.settings.section.general-options.enable-select-item-condition.label',
  },
  'enableSelectItemCondition-description': {
    id: 'admin/return-app.settings.section.general-options.enable-select-item-condition.description',
  },
})

export const GeneralOptions = () => {
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
        <FormattedMessage id="admin/return-app.settings.section.general-options.header" />
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
