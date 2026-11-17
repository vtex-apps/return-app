import type { IOContext, InstanceOptions } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export interface VtexIdCredentialInfo {
  id: string
  user: string
  account: string
  audience: string
  authStatus?: string
  tokenType?: string
}

export class VtexIdCredential extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('http://vtexid.vtexcommercestable.com.br/api/vtexid', context, {
      ...options,
      headers: {
        ...options?.headers,
        'X-Vtex-Use-Https': 'true',
      },
    })
  }

  public validate(token: string): Promise<VtexIdCredentialInfo> {
    return this.http.post<VtexIdCredentialInfo>(
      `credential/validate?an=${encodeURIComponent(this.context.account)}`,
      { token },
      { metric: 'vtexid-credential-validate' }
    )
  }
}
