import { isAdmin } from '../../utils/validators'

export async function isAdminAuthenticated(
  ctx: Context,
  next: () => Promise<any>
) {
  console.log(ctx.vtex)
  if (!ctx.vtex.sessionToken) {
    ctx.status = 401

    return
  }

  const hasAdminPermissions = await isAdmin(ctx)

  if (!hasAdminPermissions) {
    ctx.status = 401

    return
  }

  await next()
}
