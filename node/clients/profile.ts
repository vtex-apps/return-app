import type { IOContext, InstanceOptions } from '@vtex/api'
import { JanusClient } from '@vtex/api'

export class ProfileClient extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...options?.headers,
        'x-vtex-user-agent': context.userAgent,
      },
    })
  }

  public searchEmailByUserId(userId: string, token: string | undefined) {
    return this.http.get(`/api/dataentities/CL/search?userId=${userId}&_fields=email,firstName,lastName,phone`, {
      metric: 'get-email-by-userId',
      headers: {
        VtexIdClientAutCookie: token,
      }
    })
  }

  public getProfileUnmask(userId: string, token: string | undefined) {
    return this.http.get(`/api/storage/profile-system/profiles/${userId}/unmask`, {
      metric: 'get-profile-unmask',
      headers: {
        VtexIdClientAutCookie: token,
      }
    })
  }


  public getAddressUnmask(userId: string, token: string | undefined) {
    return this.http.get(`/api/storage/profile-system/profiles/${userId}/addresses/unmask`, {
      metric: 'get-address-unmask',
      headers: {
        VtexIdClientAutCookie: token,
      }
    })
  }
  
}