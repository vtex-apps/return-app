import type {
  SellerSetting,
  MutationSaveSellerSettingArgs,
} from '../../typings/SellerSetting'
import {
  validateMaxDaysCustomReasons,
  validatePaymentOptions,
  valideteUniqueCustomReasonsPerLocale,
} from '../utils/appSettingsValidation'

export async function saveSellerSettingService(
  ctx: Context,
  args: MutationSaveSellerSettingArgs
): Promise<any> {
  const {
    clients: { sellerSetting },
  } = ctx

  const { settings } = args ?? {}
  const { maxDays, customReturnReasons, paymentOptions } = settings ?? {}

  // validate if all custom reasons have max days smaller than the general max days
  validateMaxDaysCustomReasons(maxDays, customReturnReasons)

  // validate if all custom reasons have unique locales for their translations
  valideteUniqueCustomReasonsPerLocale(customReturnReasons)

  const currentSettings: any = {
    ...settings,
    // validate that there is at least one payment method selected or user has to use the same as in the order
    paymentOptions: validatePaymentOptions(paymentOptions),
  }

  const response = await sellerSetting.saveOrUpdate({
    ...currentSettings,
    id: currentSettings.id || undefined,
  })

  return response
}

export async function returnSellerSettingService(
  ctx: Context,
  sellerId: string
): Promise<SellerSetting | null> {
  const {
    clients: { sellerSetting },
  } = ctx

  const fields = [
    'id',
    'sellerId',
    'parentAccount',
    'maxDays',
    'excludedCategories',
    'paymentOptions',
    'termsUrl',
    'customReturnReasons',
    'options',
  ]

  const settings = await sellerSetting.search(
    { page: 1, pageSize: 1 },
    fields,
    undefined,
    `sellerId=${sellerId}`
  )

  return settings?.[0] || null
}
