const extractSessionData = async (ctx: Context) => {
  const { sessionData } = await ctx.clients.session.getSession(
    ctx.vtex.sessionToken ?? "",
    ["authentication.adminUserId", "authentication.adminUserEmail"]
  );

  const adminUserId =
    sessionData?.namespaces?.authentication?.adminUserId?.value;
  const adminUserEmail =
    sessionData?.namespaces?.authentication?.adminUserEmail?.value;

  return { adminUserId, adminUserEmail };
};

export async function isAuthenticated(ctx: Context, next: () => Promise<any>) {
  if (!ctx.vtex.sessionToken) {
    ctx.status = 401;
    return;
  }

  const { adminUserId, adminUserEmail } = await extractSessionData(ctx);

  if (!adminUserId || !adminUserEmail) {
    ctx.status = 401;
    return;
  }

  await next();
}
