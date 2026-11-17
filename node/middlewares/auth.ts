import { resolveRestCaller } from '../utils/resolveCaller'

export async function auth(ctx: Context, next: () => Promise<void>) {
  await resolveRestCaller(ctx)
  await next()
}
