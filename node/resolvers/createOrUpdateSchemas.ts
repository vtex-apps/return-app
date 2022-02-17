import { checkAndUpdateSchemas } from '../utils/checkAndUpdateSchemas'

export const createOrUpdateSchemas = async (
  _: unknown,
  _args: unknown,
  ctx: Context
) => {
  await checkAndUpdateSchemas(ctx)

  return true
}
