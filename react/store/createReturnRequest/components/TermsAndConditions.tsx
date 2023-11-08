import type { ChangeEvent } from 'react'
import React from 'react'
import { Checkbox } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { useStoreSettings } from '../../hooks/useStoreSettings'
import { useReturnRequest } from '../../hooks/useReturnRequest'
import { CustomMessage } from './layout/CustomMessage'

const CSS_HANDLES = [
  'termsAndConditionsContainer',
  'termsAndConditionsLink',
] as const

export const TermsAndConditions = (props) => {
  const { setIsChecked } = props

  const {
    termsAndConditions,
    inputErrors,
    actions: { toogleTermsAndConditions },
  } = useReturnRequest()

  const { data } = useStoreSettings()
  const handles = useCssHandles(CSS_HANDLES)

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target

    setIsChecked(checked)
    toogleTermsAndConditions(checked)
  }

  const hasntAcceptedTermsAndConditions = inputErrors.some(
    (error) => error === 'terms-and-conditions'
  )

  return (
    <div
      className={`${handles.termsAndConditionsContainer} flex-ns flex-wrap flex-auto flex-column pa4`}
    >
      <Checkbox
        checked={termsAndConditions}
        required
        id="agree"
        key="formAgreeCheckbox"
        label={
          <FormattedMessage
            id="return-app.return-order-details.terms-and-conditions.form-agree"
            values={{
              link: (
                <span>
                  <a
                    className={handles.termsAndConditionsContainer}
                    rel="noopener noreferrer"
                    target="_blank"
                    href={data?.termsUrl}
                  >
                    <FormattedMessage id="return-app.return-order-details.terms-and-conditions.link" />
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
          message={
            <FormattedMessage id="return-app.return-terms-and-conditions.checkbox.error" />
          }
        />
      ) : null}
    </div>
  )
}
