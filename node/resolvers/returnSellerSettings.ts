import type { QueryReturnSellerSettingsArgs } from 'vtex.return-app'

import { returnSellerSettingsService } from '../services/returnSellerSettingsService'

export const returnSellerSettings = async (
  _: unknown,
  { sellerId }: QueryReturnSellerSettingsArgs,
  ctx: Context
) => {
  return returnSellerSettingsService(ctx, sellerId)
}
