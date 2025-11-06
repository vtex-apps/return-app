import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { useReturnDetails } from '../../../hooks/useReturnDetails'

const CSS_HANDLES = ['additionalInfoContainer'] as const

const ADDITIONAL_INFO_KEYS = {
  returnAction:
    'return-app.return-request-details.additional-info.return-action',
  reasonCode: 'return-app.return-request-details.additional-info.reason-code',
  shippingMethod:
    'return-app.return-request-details.additional-info.shipping-method',
  locationCode:
    'return-app.return-request-details.additional-info.location-code',
  source: 'return-app.return-request-details.additional-info.source',
  refundShippingValue:
    'return-app.return-request-details.additional-info.refund-shipping-value',
  refundAdditionalValue:
    'return-app.return-request-details.additional-info.refund-additional-value',
} as const

export const AdditionalInfo = () => {
  const handles = useCssHandles(CSS_HANDLES)
  const { data } = useReturnDetails()

  if (!data?.returnRequestDetails) return null

  const additionalInfo = JSON.parse(
    data.returnRequestDetails.additionalInfo ?? '{}'
  )

  if (!Object.keys(additionalInfo).length) return null

  return (
    <section
      className={`${handles.additionalInfoContainer} flex-ns flex-wrap flex-auto flex-column pt2 pb4`}
    >
      <h3>
        <FormattedMessage id="return-app.return-request-details.additional-info.title" />
      </h3>
      <div className="mb5">
        {Object.entries(additionalInfo).map(([key, value]) => {
          const translationKey =
            ADDITIONAL_INFO_KEYS[key as keyof typeof ADDITIONAL_INFO_KEYS] ||
            key

          // Conditionally divide the value if the key is 'refundShippingValue'
          const displayValue =
            (key === 'refundShippingValue' ||
              key === 'refundAdditionalValue') &&
            typeof value === 'number'
              ? (value / 100).toFixed(2)
              : value

          return (
            <p key={key}>
              <strong>
                <FormattedMessage id={translationKey} />:
              </strong>{' '}
              {displayValue}
            </p>
          )
        })}
      </div>
    </section>
  )
}
