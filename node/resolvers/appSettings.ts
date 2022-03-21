const SETTINGS_PATH = 'app-settings'

const returnAppSettings = (_root: unknown, _args: unknown, ctx: Context) => {
  const {
    clients: { appSettings },
  } = ctx

  return appSettings.get(SETTINGS_PATH, true)
}

const saveReturnAppSettings = async (
  _root: unknown,
  args: { settings: unknown },
  ctx: Context
) => {
  const {
    clients: { appSettings },
  } = ctx

  await appSettings.save(SETTINGS_PATH, args.settings)

  return true
}

export const queries = { returnAppSettings }
export const mutations = { saveReturnAppSettings }
