const SETTINGS_PATH = 'app-settings'

const returnAppSettings = (_root: unknown, _args: unknown, ctx: Context) => {
  const {
    clients: { appSettings },
  } = ctx

  return appSettings.get(SETTINGS_PATH, true)
}

export const queries = { returnAppSettings }
