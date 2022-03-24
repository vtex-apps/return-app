import type { ChangeEvent, ReactElement } from 'react'
import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Toggle, CheckboxGroup } from 'vtex.styleguide'

interface CheckboxProps {
  label: ReactElement
  checked: boolean
}

export const PaymenthOptions = () => {
  const [allowSelection, setAllowSelection] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, CheckboxProps>
  >({
    bank: {
      label: (
        <FormattedMessage id="admin/return-app.settings.section.payment-options.available-payment-methods.bank" />
      ),
      checked: true,
    },
    card: {
      label: (
        <FormattedMessage id="admin/return-app.settings.section.payment-options.available-payment-methods.card" />
      ),
      checked: true,
    },
    giftCard: {
      label: (
        <FormattedMessage id="admin/return-app.settings.section.payment-options.available-payment-methods.gift-card" />
      ),
      checked: true,
    },
  })

  const handleToggle = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target

    setAllowSelection(checked)
  }

  return (
    <section>
      <h3>
        <FormattedMessage id="admin/return-app.settings.section.return-payment-options.header" />
      </h3>
      <div className="mb4 mh4">
        <Toggle
          label={
            allowSelection ? (
              <FormattedMessage id="admin/return-app.settings.section.payment-options.enable-payment-method-selection.label.check" />
            ) : (
              <FormattedMessage id="admin/return-app.settings.section.payment-options.enable-payment-method-selection.label.uncheck" />
            )
          }
          checked={allowSelection}
          semantic
          onChange={handleToggle}
          helpText={
            <FormattedMessage id="admin/return-app.settings.section.payment-options.enable-payment-method-selection.description" />
          }
        />
        {allowSelection ? (
          <div>
            <h4>
              <FormattedMessage id="admin/return-app.settings.section.payment-options.available-payment-methods.header" />
            </h4>
            <CheckboxGroup
              name="paymentMethods"
              label={
                <FormattedMessage id="admin/return-app.settings.section.payment-options.available-payment-methods.label" />
              }
              checkedMap={selectedOptions}
              onGroupChange={setSelectedOptions}
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}
