import type { QueryReturnRequestListArgs } from '../../typings/ReturnRequest'

import { returnSettingsListService } from '../services/returnSettingsListService'

export const returnSettingsList = (
  _: unknown,
  args: QueryReturnRequestListArgs,
  ctx: Context
) => {
  return returnSettingsListService(ctx, args)
}
