import React from 'react'
import { FormattedMessage } from 'react-intl'
import type { CustomerProfileDataInput } from 'vtex.return-app'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'

interface Props {
  contactDetails: CustomerProfileDataInput
}

const CSS_HANDLES = [
  'confirmContactContainer',
  'confirmContactTitle',
  'confirmContactText',
] as const

export const ConfirmContactDetails = ({ contactDetails }: Props) => {
  const handles = useCssHandles(CSS_HANDLES)

  const {
    hints: { phone },
  } = useRuntime()

  return (
    <div
      className={`${handles.confirmContactContainer} ${
        phone ? 'w-100' : 'w-40'
      }`}
    >
      <h2 className={`${handles.confirmContactTitle} mt0 mb6`}>
        <FormattedMessage id="return-app.confirm-and-submit.contact-details.title" />
      </h2>
      <p className={`${handles.confirmContactText} f6 gray`}>
        {contactDetails.name}
      </p>
      <p className={`${handles.confirmContactText} f6 gray`}>
        {contactDetails.email}
      </p>
      <p className={`${handles.confirmContactText} f6 gray`}>
        {contactDetails.phoneNumber}
      </p>
    </div>
  )
}
