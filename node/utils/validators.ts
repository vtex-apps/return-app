import { getAdminSessionData } from './request'

export async function isAdmin(ctx: Context): Promise<boolean> {
    const { adminUserEmail, adminUserId } = await getAdminSessionData(ctx)
  
    return !!(adminUserEmail && adminUserId)
  }