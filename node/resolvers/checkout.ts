export const nearestPickupPoints = async (
  _: any,
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
