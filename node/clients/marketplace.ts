import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

export class Marketplace extends JanusClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      headers: {
        VtexIdClientAutCookie: ctx.adminUserAuthToken ?? ctx.authToken,
      },
    })
  }

  public getSellers = async (seller?: string): Promise<any> =>
    this.http.get('/api/seller-register/pvt/sellers', {
      metric: 'marketplace-get-seller-list',
      params: {
        ...(seller ? { keyword: seller } : {}),
      },
    })

  public getSeller = async (sellerId: string): Promise<any> =>
    this.http.get(`api/seller-register/pvt/sellers/${sellerId}`, {
      metric: 'marketplace-get-seller-by-id',
    })
}
