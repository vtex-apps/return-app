import type { MutationUpdateSellerSettingArgs } from '../../typings/SellerSetting'
import {
  validateMaxDaysCustomReasons,
  validatePaymentOptions,
  valideteUniqueCustomReasonsPerLocale,
} from '../utils/appSettingsValidation'

export const updateSellerSetting = async (
  _: unknown,
  args: MutationUpdateSellerSettingArgs,
  ctx: Context
) => {
  const {
    clients: { sellerSetting },
  } = ctx

  const { id, settings } = args || {}

  // validate if all custom reasons have max days smaller than the general max days
  validateMaxDaysCustomReasons(settings.maxDays, settings.customReturnReasons)

  // validate if all custom reasons have unique locales for their translations
  valideteUniqueCustomReasonsPerLocale(settings.customReturnReasons)

  const currentSettings: any = {
    ...settings,
    // validate that there is at least one payment method selected or user has to use the same as in the order
    paymentOptions: validatePaymentOptions(settings.paymentOptions),
  }

  if (id) {
    await sellerSetting.update(id, currentSettings)

    return true
  }

  return false
}
