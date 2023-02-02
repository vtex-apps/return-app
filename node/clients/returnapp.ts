import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export default class ReturnApp extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('', context, {
      ...options,
      headers: {
        ...(options?.headers ?? {}),
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Vtex-Use-Https': 'true',
      },
    })
  }

  public async getCategories(ctx: any): Promise<any> {
    return this.http.get(
      `http://${ctx.vtex.account}.vtexcommercestable.com.br/api/catalog_system/pub/category/tree/100`
    )
  }

  public async getSkuById(ctx: any, id: any): Promise<any> {
    return this.http.get(
      `http://${ctx.vtex.account}.vtexcommercestable.com.br/api/catalog/pvt/stockkeepingunit/${id}`,
      {
        headers: {
          VtexIdclientAutCookie: ctx.vtex.authToken,
        },
      }
    )
  }

  public async getGiftCard(ctx: any, id: any): Promise<any> {
    return this.http.get(
      `http://${ctx.vtex.account}.vtexcommercestable.com.br/api/giftcards/${id}`,
      {
        headers: {
          VtexIdclientAutCookie: ctx.vtex.authToken,
        },
      }
    )
  }

  public async getOrders(ctx: any, where: any): Promise<any> {
    return this.http.get(
      `http://${ctx.vtex.account}.vtexcommercestable.com.br/api/oms/pvt/orders?${where}`,
      {
        headers: {
          VtexIdclientAutCookie: ctx.vtex.authToken,
        },
      }
    )
  }

  public async getOrder(ctx: any, orderId: any): Promise<any> {
    return this.http.get(
      `http://${ctx.vtex.account}.vtexcommercestable.com.br/api/oms/pvt/orders/${orderId}`,
      {
        headers: {
          VtexIdclientAutCookie: ctx.vtex.authToken,
        },
      }
    )
  }

  public async createGiftCard(
    ctx: any,
    body: Record<string, any>
  ): Promise<any> {
    return this.http.post(
      `http://${ctx.vtex.account}.vtexcommercestable.com.br/api/giftcards/`,
      body,
      {
        headers: {
          VtexIdclientAutCookie: ctx.vtex.authToken,
        },
      }
    )
  }

  public async updateGiftCard(
    ctx: any,
    giftCardId: any,
    body: Record<string, any>
  ): Promise<any> {
    return this.http.post(
      `http://${ctx.vtex.account}.vtexcommercestable.com.br/api/gift-card-system/pvt/giftCards/${giftCardId}/credit`,
      body,
      {
        headers: {
          VtexIdclientAutCookie: ctx.vtex.adminUserAuthToken,
        },
      }
    )
  }

  // eslint-disable-next-line max-params
  public async updateGiftCardApi(
    ctx: any,
    giftCardId: any,
    body: Record<string, any>,
    headers: any
  ): Promise<any> {
    return this.http.post(
      `http://${ctx.vtex.account}.vtexcommercestable.com.br/api/gift-card-system/pvt/giftCards/${giftCardId}/credit`,
      body,
      {
        headers: {
          'x-vtex-api-apptoken': headers['x-vtex-api-apptoken'],
          'X-VTEX-API-AppKey': headers['x-vtex-api-appkey'],
        },
      }
    )
  }

  public async sendMail(ctx: any, body: Record<string, any>): Promise<any> {
    return this.http.post(
      `http://${ctx.vtex.account}.vtexcommercestable.com.br/api/mail-service/pvt/sendmail`,
      body,
      {
        headers: {
          VtexIdclientAutCookie: ctx.vtex.authToken,
        },
      }
    )
  }

  public async createRefund(ctx: any, orderId: any, body: any): Promise<any> {
    return this.http.post(
      `http://${ctx.vtex.account}.vtexcommercestable.com.br/api/oms/pvt/orders/${orderId}/invoice`,
      body,
      {
        headers: {
          VtexIdclientAutCookie: ctx.vtex.adminUserAuthToken,
        },
      }
    )
  }
}
