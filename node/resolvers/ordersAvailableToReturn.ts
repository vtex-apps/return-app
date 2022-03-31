export const ordersAvailableToReturn = async (
  _: unknown,
  _args: unknown,
  ctx: Context
) => {
  const {
    state: { userProfile },
  } = ctx

  // eslint-disable-next-line no-console
  console.log({ userProfile })

  return true
}
