import type { ChangeEvent } from 'react'
import React, { useState } from 'react'
import { Checkbox } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import { useStoreSettings } from '../../hooks/useStoreSettings'

export const TermsAndConditions = () => {
  const [termsAndConditions, setTermsAndConditions] = useState(false)

  const { data } = useStoreSettings()

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target

    setTermsAndConditions(checked)
  }

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
    </div>
  )
}
