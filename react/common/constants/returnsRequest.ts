import type { IntlFormatters } from 'react-intl'

import { defaultReturnReasonsMessages } from '../../store/utils/defaultReturnReasonsMessages'

export function getReasonOptions(
  formatMessage: IntlFormatters['formatMessage']
) {
  return [
    {
      value: 'reasonAccidentalOrder',
      label: formatMessage(defaultReturnReasonsMessages.reasonAccidentalOrder),
    },
    {
      value: 'reasonBetterPrice',
      label: formatMessage(defaultReturnReasonsMessages.reasonBetterPrice),
    },
    {
      value: 'reasonPerformance',
      label: formatMessage(defaultReturnReasonsMessages.reasonPerformance),
    },
    {
      value: 'reasonIncompatible',
      label: formatMessage(defaultReturnReasonsMessages.reasonIncompatible),
    },
    {
      value: 'reasonItemDamaged',
      label: formatMessage(defaultReturnReasonsMessages.reasonItemDamaged),
    },
    {
      value: 'reasonMissedDelivery',
      label: formatMessage(defaultReturnReasonsMessages.reasonMissedDelivery),
    },
    {
      value: 'reasonMissingParts',
      label: formatMessage(defaultReturnReasonsMessages.reasonMissingParts),
    },
    {
      value: 'reasonBoxDamaged',
      label: formatMessage(defaultReturnReasonsMessages.reasonBoxDamaged),
    },
    {
      value: 'reasonDifferentProduct',
      label: formatMessage(defaultReturnReasonsMessages.reasonDifferentProduct),
    },
    {
      value: 'reasonDefective',
      label: formatMessage(defaultReturnReasonsMessages.reasonDefective),
    },
    {
      value: 'reasonArrivedInAddition',
      label: formatMessage(
        defaultReturnReasonsMessages.reasonArrivedInAddition
      ),
    },
    {
      value: 'reasonNoLongerNeeded',
      label: formatMessage(defaultReturnReasonsMessages.reasonNoLongerNeeded),
    },
    {
      value: 'reasonUnauthorizedPurchase',
      label: formatMessage(
        defaultReturnReasonsMessages.reasonUnauthorizedPurchase
      ),
    },
    {
      value: 'reasonDifferentFromWebsite',
      label: formatMessage(
        defaultReturnReasonsMessages.reasonDifferentFromWebsite
      ),
    },
  ]
}
