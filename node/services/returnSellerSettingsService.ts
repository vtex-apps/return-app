import type { SellerSetting } from '../../typings/SellerSetting'

export async function returnSellerSettingsService(
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

  // if(settings?.[0]){
  //   const response: ReturnAppSettings = {
  //     maxDays: settings?.[0]?.maxDays,
  //     excludedCategories: settings?.[0]?.excludedCategories,
  //     paymentOptions: settings?.[0]?.paymentOptions,
  //     termsUrl: settings?.[0]?.termsUrl,
  //     customReturnReasons:settings?.[0]?.customReturnReasons,
  //     options: settings?.[0]?.options,
  //   }
  //   return response
  // }else{
  //   return null
  // }
  return settings?.[0] || null
}
