import { json } from 'co-body'

import { SETTINGS_PATH } from '../utils/constants'
import schemaAppSetting from '../utils/appSettingSchema'

export async function saveAppSetting(ctx: Context) {
  const {
    req,
    clients: { appSettings },
  } = ctx

  const body = await json(req)

  try {
    await schemaAppSetting.validateAsync(body)

    const settings = await appSettings.get(SETTINGS_PATH, true)

    const newSettings = {
      ...settings,
      ...body,
    }

    await appSettings.save(SETTINGS_PATH, newSettings)

    ctx.body = { settingsSaved: newSettings }
    ctx.status = 201
  } catch (error) {
    const errors = error.details
      ? error.details.map((detail: any) => detail.message)
      : [error.message]

    ctx.body = { errors }
    ctx.status = 400
  }
}

export async function returnAppSetting(ctx: Context) {
  const {
    clients: { appSettings },
  } = ctx

  const settings = await appSettings.get(SETTINGS_PATH, true)

  ctx.body = settings
  ctx.status = 201
}
