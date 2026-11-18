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

      // 401 and 403 reject the app's own credential, not the login being
      // checked. Log it and let the caller answer with a retryable error.
      if (status === 401 || status === 403) {
        this.context.logger.error({
          message: 'License Manager rejected the app credential',
          status,
        })

        throw error
      }

      // Other 4xx (except the transient 408 and 429) mean "not granted".
      const isNotGranted =
        typeof status === 'number' &&
        status >= 400 &&
        status < 500 &&
        status !== 408 &&
        status !== 429

      if (isNotGranted) return false

      throw error
    }
  }
}
