import React, { useState, useEffect, useContext } from 'react'
import { Checkbox } from 'vtex.styleguide'
import { useIntl, defineMessages, FormattedMessage } from 'react-intl'

import { StoreSettingsContext } from '../../provider/StoreSettingsProvider'

const messages = defineMessages({
  formAgree: {
    id: 'store/return-app.return-order-details.terms-and-conditions.form-agree',
  },
})

export const TermsAndConditions = () => {
  const { formatMessage } = useIntl()
  const [termsAndConditions, setTermsAndConditions] = useState(false)
  const [termsAndConditionsSettings, setTermsAndConditionsSettings] =
    useState('')

  const { data } = useContext(StoreSettingsContext)

  useEffect(() => {
    if (data) {
      setTermsAndConditionsSettings(data?.termsUrl)
    }
  }, [data])

  const renderTermsAndConditions = () => {
    return formatMessage(
      {
        id: messages.formAgree.id,
      },
      {
        link: (
          <span>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href={termsAndConditionsSettings}
            >
              <FormattedMessage id="store/return-app.return-order-details.terms-and-conditions.link" />
            </a>
          </span>
        ),
      }
    )
  }

  const handleInputChange = (event) => {
    const { checked } = event.target

    setTermsAndConditions(checked)
  }

  return (
    <div className="flex-ns flex-wrap flex-auto flex-column pa4">
      <Checkbox
        checked={termsAndConditions}
        id="agree"
        key="formAgreeCheckbox"
        label={renderTermsAndConditions()}
        name="agree"
        onChange={handleInputChange}
        value={termsAndConditions}
      />
    </div>
  )
}
