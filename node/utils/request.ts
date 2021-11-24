export async function getAdminSessionData(ctx: Context) {
    const { sessionData } = await ctx.clients.session.getSession(
      ctx.vtex.sessionToken ?? '',
      ['authentication.adminUserId', 'authentication.adminUserEmail']
    )
  
    const adminUserId =
      sessionData?.namespaces?.authentication?.adminUserId?.value
  
    const adminUserEmail =
      sessionData?.namespaces?.authentication?.adminUserEmail?.value
  
    return { adminUserId, adminUserEmail }
  }