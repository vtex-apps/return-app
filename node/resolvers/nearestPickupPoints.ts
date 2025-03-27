import type {
  QueryNearestPickupPointsArgs,
  NearPickupPointQueryResponse,
} from 'odp.return-app'

export const nearestPickupPoints = async (
  _: unknown,
  { lat, long }: QueryNearestPickupPointsArgs,
  ctx: Context
): Promise<NearPickupPointQueryResponse> => {
  const {
    clients: { checkout },
  } = ctx

  const closestPickupPointsData = await checkout.getNearestPickupPoints(
    lat,
    long
  )

  return closestPickupPointsData
}
