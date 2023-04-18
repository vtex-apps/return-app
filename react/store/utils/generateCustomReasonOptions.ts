import type { CustomReturnReason } from '../../../typings/ReturnAppSettings'

import { isWithinMaxDaysToReturn } from '../../../node/utils/dateHelpers'

interface Option {
  value: string
  label: string
}

export function generateCustomReasonOptions(
  customReturnReasons: CustomReturnReason[],
  locale: string,
  creationDate: string
) {
  return customReturnReasons.reduce(
    (filteredOptions: Option[], customReason: CustomReturnReason) => {
      if (!isWithinMaxDaysToReturn(creationDate, customReason.maxDays)) {
        return filteredOptions
      }

      const localizedOption = customReason?.translations?.find(
        (element) => element.locale === locale
      )

      const reason = localizedOption?.translation ?? customReason.reason

      const newOption = {
        value: reason,
        label: reason,
      }

      filteredOptions.push(newOption)

      return filteredOptions
    },
    []
  )
}
