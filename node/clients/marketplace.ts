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

  public getSellers = async (): Promise<any> =>
    this.http.get('/api/seller-register/pvt/sellers', {
      metric: 'marketplace-get-seller-list',
    })
}
