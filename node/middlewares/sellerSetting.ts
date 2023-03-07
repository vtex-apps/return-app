import { json } from 'co-body'
import { saveSellerSettingService, returnSellerSettingService } from '../services/SellerSettingService'
import { SETTINGS_PATH } from '../utils/constants'

export async function saveSellerSetting(ctx: Context) {
  const { req } = ctx

  const body = await json(req)
  ctx.set('Cache-Control', 'no-cache')
  
  try {
    ctx.body = await saveSellerSettingService(ctx, body)

    ctx.status = 200
  } catch (error) {
    ctx.status = 400
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
    const settings = await returnSellerSettingService(ctx, sellerId)

    if(!settings){
      const settingsMkt: any = await appSettings.get(SETTINGS_PATH, true)

      const newSettings = {
        settings: {
          ...settingsMkt,
          sellerId,
          parentAccount: ctx.vtex.account
        }
      }

      const res = await saveSellerSettingService(ctx, newSettings)

      ctx.body = {
        ...newSettings?.settings,
        id: res.DocumentId
      }

      ctx.status = 200
    } else {
      ctx.body = settings
      ctx.status = 200
    }
  } catch (error) {
    ctx.body = error
    ctx.status = 400
  }
}