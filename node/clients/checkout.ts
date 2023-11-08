import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

import type { NearPickupPointQueryResponse } from '../../typings/PickupPoints'

export default class Checkout extends JanusClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      headers: {
        ...(options?.headers ?? {}),
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Vtex-Use-Https': 'true',
      },
    })
  }

  public getNearestPickupPoints = async (
    lat: string,
    long: string
  ): Promise<NearPickupPointQueryResponse> => {
    return this.http.get(
      `/api/checkout/pub/pickup-points?geoCoordinates=${lat};${long}`,
      {
        metric: 'checkout-nearestPickupPoints',
      }
    )
  }
}
