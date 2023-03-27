import { UserInputError } from '@vtex/api'

import {
  saveSellerSettingService,
  returnSellerSettingService,
} from '../services/SellerSettingService'
import { SETTINGS_PATH } from '../utils/constants'

export async function saveSellerSetting(ctx: Context) {
  const { body }: any = ctx || {}

  ctx.set('Cache-Control', 'no-cache')

  try {
    const settings = await returnSellerSettingService(
      ctx,
      body?.settings?.sellerId
    )

    if (settings) {
      body.settings.id = settings.id
    }

    ctx.body = await saveSellerSettingService(ctx, body)

    ctx.status = 200
  } catch (error) {
    ctx.body = error?.response?.data || error.response.statusText || error
    ctx.status = error.response?.status || 400
  }
}

export async function returnSellerSetting(ctx: Context) {
  const {
    clients: { appSettings },
    vtex: {
      route: { params },
    },
  } = ctx

  const { sellerId } = params as { sellerId: string }

  ctx.set('Cache-Control', 'no-cache')

  try {
    if (sellerId) {
      const settings = await returnSellerSettingService(ctx, sellerId)

      if (!settings) {
        const settingsMkt: any = await appSettings.get(SETTINGS_PATH, true)

        const newSettings = {
          settings: {
            ...settingsMkt,
            sellerId,
            parentAccount: ctx.vtex.account,
          },
        }

        const res = await saveSellerSettingService(ctx, newSettings)

        ctx.body = {
          ...newSettings?.settings,
          id: res.DocumentId,
        }

        ctx.status = 200
      } else {
        ctx.body = settings
        ctx.status = 200
      }
    } else {
      throw new UserInputError('sellerId is required')
    }
  } catch (error) {
    ctx.body = error?.response?.data || error.response.statusText || error
    ctx.status = error.response?.status || 400
  }
}
