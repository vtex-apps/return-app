import type { ChangeEvent } from 'react'
import React from 'react'
import { Input, Dropdown } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import { useSettings } from '../hooks/useSettings'
import { ORDER_STATUS } from '../../../utils/constant'

export const RequiredOptions = () => {
  const { appSettings, actions } = useSettings()

  const dispatch = actions?.dispatch

  const handleMaxDaysInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const maxDays = Number(value)

    if (Number.isNaN(maxDays) || maxDays < 0) {
      return
    }

    dispatch({ type: 'updateMaxDays', payload: maxDays })
  }

  const handleOrderStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    dispatch({ type: 'updateOrderStatus', payload: value })
  }

  const handleTermsAndConditionInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    dispatch({ type: 'updateTermsUrl', payload: value })
  }

  return (
    <>
      <section className="mb6 flex flex-column">
        <div className="flex flex-row">
          <div className="w-50 ph1">
            <Input
              // logic to avoid leading zero to be persistent in the input
              value={appSettings?.maxDays === 0 ? '' : appSettings?.maxDays}
              type="number"
              size="regular"
              label={
                <FormattedMessage id="admin/return-app.settings.max-days.label" />
              }
              onChange={handleMaxDaysInput}
              errorMessage=""
              required
            />
          </div>
          <div className="w-50 ph1">
            <FormattedMessage id="admin/return-app.settings.order-status.placeholder">
              {(placehoder) => (
                <Dropdown
                  label={
                    <FormattedMessage id="admin/return-app.settings.order-status.label" />
                  }
                  placeholder={placehoder}
                  options={ORDER_STATUS}
                  value={appSettings?.orderStatus}
                  onChange={handleOrderStatus}
                  preventTruncate
                />
              )}
            </FormattedMessage>
          </div>
        </div>
      </section>
      <section className="mb6 flex flex-column">
        <div className="flex flex-row">
          <div className="w-100 ph1">
            <Input
              value={appSettings?.termsUrl}
              type="url"
              size="regular"
              label={
                <FormattedMessage id="admin/return-app.settings.terms.label" />
              }
              onChange={handleTermsAndConditionInput}
              errorMessage=""
              required
            />
          </div>
        </div>
      </section>
    </>
  )
}
