import type { IOContext, InstanceOptions } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export class LicenseManager extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(
      `http://${context.account}.vtexcommercestable.com.br/api/license-manager/`,
      context,
      {
        ...options,
        headers: {
          ...options?.headers,
          VtexIdclientAutCookie: context.authToken,
          'X-Vtex-Use-Https': 'true',
        },
      }
    )
  }

  public async isGranted(login: string): Promise<boolean> {
    const { account } = this.context

    try {
      const granted = await this.http.get<boolean>(
        `pvt/accounts/${encodeURIComponent(
          account
        )}/logins/${encodeURIComponent(login)}/granted`,
        { metric: 'license-manager-granted' }
      )

      return granted === true
    } catch (error) {
      const status = (error as { response?: { status?: unknown } })?.response
        ?.status

      if (typeof status === 'number' && status >= 400 && status < 500) {
        return false
      }

      throw error
    }
  }
}
