import type { IOContext, InstanceOptions } from '@vtex/api'
import { AuthenticationError, JanusClient } from '@vtex/api'

interface VtexIdLoginResponse {
  authStatus: string
  token: string
  expires: number
}

interface AuthenticatedUser {
  userId: string
  user: string
  userType: string
}

export class VtexId extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...options?.headers,
        'x-vtex-user-agent': context.userAgent,
      },
    })
  }

  public login({
    appkey,
    apptoken,
  }: {
    appkey: string
    apptoken: string
  }): Promise<VtexIdLoginResponse> {
    return this.http.post(
      '/api/vtexid/apptoken/login',
      {
        appkey,
        apptoken,
      },
      {
        metric: 'vtexid-login',
      }
    )
  }

  public getAuthenticatedUser(
    authToken: string
  ): Promise<AuthenticatedUser | null> {
    return this.http.get('/api/vtexid/pub/authenticated/user/', {
      metric: 'vtexid-get-authenticated-user',
      params: {
        authToken,
      },
    })
  }

  public async getAccount(token: string, account: string): Promise<any> {
    try {
      const response = await this.http.get(`/api/vlm/account?an=${account}`, {
        metric: 'vtexid-get-account',
        headers: {
          VtexIdClientAutCookie: token || '',
        },
      })

      return response
    } catch (error) {
      throw new AuthenticationError('Request failed with status code 401')
    }
  }
}
