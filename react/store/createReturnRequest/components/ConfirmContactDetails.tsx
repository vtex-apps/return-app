import React from 'react'
import { FormattedMessage } from 'react-intl'
import type { CustomerProfileDataInput } from 'vtex.return-app'
import { useCssHandles } from 'vtex.css-handles'

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

  return (
    <div className={`${handles.confirmContactContainer} w-40`}>
      <h2 className={`${handles.confirmContactTitle} mt0 mb6`}>
        <FormattedMessage id="store/return-app.confirm-and-submit.contact-details.title" />
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
