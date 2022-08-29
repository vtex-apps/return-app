import type { InstanceOptions, IOContext } from '@vtex/api'
import { AuthType, IOClient } from '@vtex/api'

const useHttps = !process.env.VTEX_IO

export class MarketplaceAppClient extends IOClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      authType: AuthType.bearer,
      baseURL: `${
        useHttps ? 'https' : 'http'
      }://app.io.vtex.com/vtex.return-app/v3`,
      name: 'return-app',
      headers: {
        ...options?.headers,
        ...(context.authToken
          ? {
              // Will a request coming form the API have adminUserAUthToken? Does it matter?
              // context.adminUserAuthToken ?? context.authToken,
              // When using adminUserAuthToken, Sphinx parse the user email, not the app calling it. We can use it, but then we need to find a different away to get the seller calling it.
              // with authToken we get user as: vrn--vtexsphinx--aws-us-east-1--powerplanet--filarmamvp--link_vtex.return-app@3.5.0
              VtexIdclientAutCookie: context.authToken,
            }
          : null),
        'Content-Type': 'application/json',
      },
    })
  }

  public getRMAList = async (): Promise<any> =>
    this.http.get('/vtexspain/filarmamvp/_v/return-request')
}
