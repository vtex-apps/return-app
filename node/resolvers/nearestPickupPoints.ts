export const nearestPickupPoints = async (
  _: unknown,
  { lat, long }: CheckoutPickupPointsArgs,
  ctx: Context
): Promise<CheckoutOutput> => {
  const {
    clients: { checkout },
  } = ctx

  const closestPickupPointsData = await checkout.getNearestPickupPoints(
    lat,
    long
  )

  return closestPickupPointsData
}
