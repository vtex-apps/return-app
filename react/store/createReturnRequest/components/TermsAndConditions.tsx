import type { ChangeEvent } from 'react'
import React from 'react'
import { Checkbox } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import { useStoreSettings } from '../../hooks/useStoreSettings'
import { useReturnRequest } from '../../hooks/useReturnRequest'
import { CustomMessage } from './layout/CustomMessage'

export const TermsAndConditions = () => {
  const {
    termsAndConditions,
    inputErrors,
    actions: { toogleTermsAndConditions },
  } = useReturnRequest()

  const { data } = useStoreSettings()

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target

    toogleTermsAndConditions(checked)
  }

  const hasntAcceptedTermsAndConditions = inputErrors.some(
    (error) => error === 'terms-and-conditions'
  )

  return (
    <div className="flex-ns flex-wrap flex-auto flex-column pa4">
      <Checkbox
        checked={termsAndConditions}
        required
        id="agree"
        key="formAgreeCheckbox"
        label={
          <FormattedMessage
            id="store/return-app.return-order-details.terms-and-conditions.form-agree"
            values={{
              link: (
                <span>
                  <a
                    rel="noopener noreferrer"
                    target="_blank"
                    href={data?.termsUrl}
                  >
                    <FormattedMessage id="store/return-app.return-order-details.terms-and-conditions.link" />
                  </a>
                </span>
              ),
            }}
          />
        }
        name="agree"
        onChange={handleInputChange}
        value={termsAndConditions}
      />
      {hasntAcceptedTermsAndConditions ? (
        <CustomMessage
          status="error"
          message="store/return-app.return-terms-and-conditions.checkbox.error"
        />
      ) : null}
    </div>
  )
}
