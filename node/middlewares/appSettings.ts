import { json } from 'co-body'

import { saveAppSettingService } from '../services/AppSettingsService'
import { SETTINGS_PATH } from '../utils/constants'

export async function saveAppSetting(ctx: Context) {
  const { req } = ctx

  const body = await json(req)

  ctx.body = await saveAppSettingService(ctx, body)
  ctx.status = 201
}

export async function returnAppSetting(ctx: Context) {
  const {
    clients: { appSettings },
  } = ctx

  const settings = await appSettings.get(SETTINGS_PATH, true)

  ctx.body = settings
  ctx.status = 201
}
