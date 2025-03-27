import type { IntlFormatters } from 'react-intl'

import { defaultReturnReasonsMessages } from '../../store/utils/defaultReturnReasonsMessages'

export function getReasonOptions(
  formatMessage: IntlFormatters['formatMessage']
) {
  const reasonAccidentalOrder = formatMessage(
    defaultReturnReasonsMessages.reasonAccidentalOrder
  )

  const reasonBetterPrice = formatMessage(
    defaultReturnReasonsMessages.reasonBetterPrice
  )

  const reasonPerformance = formatMessage(
    defaultReturnReasonsMessages.reasonPerformance
  )

  const reasonItemDamaged = formatMessage(
    defaultReturnReasonsMessages.reasonItemDamaged
  )

  const reasonIncompatible = formatMessage(
    defaultReturnReasonsMessages.reasonIncompatible
  )

  const reasonMissedDelivery = formatMessage(
    defaultReturnReasonsMessages.reasonMissedDelivery
  )

  const reasonMissingParts = formatMessage(
    defaultReturnReasonsMessages.reasonMissingParts
  )

  const reasonBoxDamaged = formatMessage(
    defaultReturnReasonsMessages.reasonBoxDamaged
  )

  const reasonDifferentProduct = formatMessage(
    defaultReturnReasonsMessages.reasonDifferentProduct
  )

  const reasonDefective = formatMessage(
    defaultReturnReasonsMessages.reasonDefective
  )

  const reasonArrivedInAddition = formatMessage(
    defaultReturnReasonsMessages.reasonArrivedInAddition
  )

  const reasonNoLongerNeeded = formatMessage(
    defaultReturnReasonsMessages.reasonNoLongerNeeded
  )

  const reasonUnauthorizedPurchase = formatMessage(
    defaultReturnReasonsMessages.reasonUnauthorizedPurchase
  )

  const reasonDifferentFromWebsite = formatMessage(
    defaultReturnReasonsMessages.reasonDifferentFromWebsite
  )

  return [
    {
      value: reasonAccidentalOrder,
      label: reasonAccidentalOrder,
    },
    {
      value: reasonBetterPrice,
      label: reasonBetterPrice,
    },
    {
      value: reasonPerformance,
      label: reasonPerformance,
    },
    {
      value: reasonIncompatible,
      label: reasonIncompatible,
    },
    {
      value: reasonItemDamaged,
      label: reasonItemDamaged,
    },
    {
      value: reasonMissedDelivery,
      label: reasonMissedDelivery,
    },
    {
      value: reasonMissingParts,
      label: reasonMissingParts,
    },
    {
      value: reasonBoxDamaged,
      label: reasonBoxDamaged,
    },
    {
      value: reasonDifferentProduct,
      label: reasonDifferentProduct,
    },
    {
      value: reasonDefective,
      label: reasonDefective,
    },
    {
      value: reasonArrivedInAddition,
      label: reasonArrivedInAddition,
    },
    {
      value: reasonNoLongerNeeded,
      label: reasonNoLongerNeeded,
    },
    {
      value: reasonUnauthorizedPurchase,
      label: reasonUnauthorizedPurchase,
    },
    {
      value: reasonDifferentFromWebsite,
      label: reasonDifferentFromWebsite,
    },
  ]
}
