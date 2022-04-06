import type { InstanceOptions, IOContext } from '@vtex/api'
import { OMS } from '@vtex/clients'

const baseURL = '/api/oms'

const routes = {
  orders: `${baseURL}/pvt/orders`,
}

interface OrderList {
  // This API returns more than orderId, but we only need the orderId so far
  list: Array<{ orderId: string; creationDate: string }>
  paging: {
    total: number
    pages: number
    currentPage: number
    perPage: number
  }
}

interface OrderListParams {
  clientEmail: string
  orderBy: 'creationDate,desc'
  f_status: 'invoiced'
  f_creationDate: string
  page: number
  per_page: 10
}

export class OMSCustom extends OMS {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      headers: {
        VtexIdClientAutCookie: ctx.authToken,
      },
    })
  }

  public listOrdersWithParams(params?: OrderListParams) {
    return this.http.get<OrderList>(routes.orders, {
      metric: 'oms-list-order-with-params',
      ...(params ? { params } : {}),
    })
  }
}
