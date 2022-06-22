import type { IntlFormatters } from 'react-intl'

import { defaultReturnReasonsMessages } from '../../store/utils/defaultReturnReasonsMessages'

export function getReasonOptions(
  formatMessage: IntlFormatters['formatMessage']
) {
  return [
    {
      value: formatMessage(defaultReturnReasonsMessages.reasonAccidentalOrder),
      label: formatMessage(defaultReturnReasonsMessages.reasonAccidentalOrder),
    },
    {
      value: formatMessage(defaultReturnReasonsMessages.reasonBetterPrice),
      label: formatMessage(defaultReturnReasonsMessages.reasonBetterPrice),
    },
    {
      value: formatMessage(defaultReturnReasonsMessages.reasonPerformance),
      label: formatMessage(defaultReturnReasonsMessages.reasonPerformance),
    },
    {
      value: formatMessage(defaultReturnReasonsMessages.reasonIncompatible),
      label: formatMessage(defaultReturnReasonsMessages.reasonIncompatible),
    },
    {
      value: formatMessage(defaultReturnReasonsMessages.reasonItemDamaged),
      label: formatMessage(defaultReturnReasonsMessages.reasonItemDamaged),
    },
    {
      value: formatMessage(defaultReturnReasonsMessages.reasonMissedDelivery),
      label: formatMessage(defaultReturnReasonsMessages.reasonMissedDelivery),
    },
    {
      value: formatMessage(defaultReturnReasonsMessages.reasonMissingParts),
      label: formatMessage(defaultReturnReasonsMessages.reasonMissingParts),
    },
    {
      value: formatMessage(defaultReturnReasonsMessages.reasonBoxDamaged),
      label: formatMessage(defaultReturnReasonsMessages.reasonBoxDamaged),
    },
    {
      value: formatMessage(defaultReturnReasonsMessages.reasonDifferentProduct),
      label: formatMessage(defaultReturnReasonsMessages.reasonDifferentProduct),
    },
    {
      value: formatMessage(defaultReturnReasonsMessages.reasonDefective),
      label: formatMessage(defaultReturnReasonsMessages.reasonDefective),
    },
    {
      value: formatMessage(
        defaultReturnReasonsMessages.reasonArrivedInAddition
      ),
      label: formatMessage(
        defaultReturnReasonsMessages.reasonArrivedInAddition
      ),
    },
    {
      value: formatMessage(defaultReturnReasonsMessages.reasonNoLongerNeeded),
      label: formatMessage(defaultReturnReasonsMessages.reasonNoLongerNeeded),
    },
    {
      value: formatMessage(
        defaultReturnReasonsMessages.reasonUnauthorizedPurchase
      ),
      label: formatMessage(
        defaultReturnReasonsMessages.reasonUnauthorizedPurchase
      ),
    },
    {
      value: formatMessage(
        defaultReturnReasonsMessages.reasonDifferentFromWebsite
      ),
      label: formatMessage(
        defaultReturnReasonsMessages.reasonDifferentFromWebsite
      ),
    },
  ]
}
