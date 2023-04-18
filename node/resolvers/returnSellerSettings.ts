import type { QueryReturnSellerSettingsArgs } from '../../typings/SellerSetting'

import { returnSellerSettingsService } from '../services/returnSellerSettingsService'

export const returnSellerSettings = async (
  _: unknown,
  { sellerId }: QueryReturnSellerSettingsArgs,
  ctx: Context
) => {
  return returnSellerSettingsService(ctx, sellerId)
}
