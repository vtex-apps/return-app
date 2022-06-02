import type { InstanceOptions, IOContext, RequestConfig } from '@vtex/api'
import { JanusClient } from '@vtex/api'
import type { NearPickupPointQueryResponse } from 'vtex.return-app'

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

  public getNearestPickupPoints = (lat: string, long: string) => {
    return this.get<NearPickupPointQueryResponse>(
      this.routes.getNearestPickupPoints(lat, long),
      {
        metric: 'checkout-nearestPickupPoints',
      }
    )
  }

  protected get = async <T>(url: string, config: RequestConfig = {}) => {
    try {
      return await this.http.get<T>(url, config)
    } catch (e) {
      return e
    }
  }

  private get routes() {
    const base = '/api/checkout/pub'

    return {
      getNearestPickupPoints: (lat: string, long: string) =>
        `${base}/pickup-points?geoCoordinates=${lat};${long}`,
    }
  }
}
