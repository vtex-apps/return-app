import { AuthenticationError } from '@vtex/api'

export async function adminAccess(ctx: Context, next: () => Promise<void>) {
  const {
    state: { userProfile, appkey },
  } = ctx

  if (userProfile?.role === 'admin' || Boolean(appkey)) {
    await next()
  } else {
    throw new AuthenticationError('Request failed with status code 401')
  }
}
