export const nearestPickupPoints = async (
  _: any,
  { lat, long }: CheckoutPickupPointsArgs,
  ctx: Context
) => {
  const {
    clients: { checkout },
  } = ctx

  const closestPickupPointsData = await checkout.getNearestPickupPoints(
    lat,
    long
  )

  return closestPickupPointsData
}
