export const nearestPickupPoints = async (
  _: any,
  { lat, long }: CheckoutPickupPointsArgs,
  ctx: Context
) => {
  const {
    clients: { checkout },
  } = ctx

  try {
    const closestPickupPointsData = await checkout.getNearestPickupPoints(
      lat,
      long
    )

    return closestPickupPointsData
  } catch (error) {
    console.log(error.response, '----specific errror----')
  }
}
