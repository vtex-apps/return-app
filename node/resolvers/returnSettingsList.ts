import type { QueryReturnRequestListArgs } from 'vtex.return-app'

import { returnSettingsListService } from '../services/returnSettingsListService'

export const returnSettingsList = (
  _: unknown,
  args: QueryReturnRequestListArgs,
  ctx: Context
) => {
  return returnSettingsListService(ctx, args)
}
