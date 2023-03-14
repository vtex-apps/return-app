
import { returnSellerSettingsService } from '../services/returnSellerSettingsService'
import type {
  QueryReturnSellerSettingsArgs,
} from 'vtex.return-app'

export const returnSellerSettings = async (
  _: unknown,
  { sellerId } : QueryReturnSellerSettingsArgs,
  ctx: Context
) => {
  return returnSellerSettingsService(ctx, sellerId)
}
