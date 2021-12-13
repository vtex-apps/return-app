import ReturnAppSettings from "../typings/settings"

const APP_SETTINGS_PROPERTIES = [
    'cronId',
    'authToken'
  ]

export const getSettings = async (
    ctx: Context<any>
  ): Promise<ReturnAppSettings> => {
    const {
      clients: { apps },
      vtex: { account },
    } = ctx
  
    const settings = await apps.getAppSettings(ctx.vtex.userAgent)
  
    return {
      ...settings,
      account,
    }
}

interface ValidationResponse {
    hasError: boolean
    message: string
  }

export const validateSettings = (settings: any): ValidationResponse => {
    if (!settings) {
      return {
        hasError: true,
        message: 'No settings found!',
      }
    }
  
    const missingProperty = APP_SETTINGS_PROPERTIES.find(
      (item) => !settings[item]
    )
  
    if (missingProperty) {
      return {
        hasError: true,
        message: `Settings missing property: ${missingProperty}`,
      }
    }
  
    return { hasError: false, message: '' }
  }