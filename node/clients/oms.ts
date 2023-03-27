import type { InstanceOptions, IOContext } from '@vtex/api'
import type { NotificationResponse, NotificationInput } from '@vtex/clients'
import { OMS } from '@vtex/clients'

const baseURL = '/api/oms'

const routes = {
  orders: `${baseURL}/pvt/orders`,
  invoice: (orderId: string) => `${baseURL}/pvt/orders/${orderId}/invoice`,
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

type InputInvoiceFields = Omit<
  NotificationInput,
  'invoiceKey' | 'invoiceUrl' | 'courier' | 'trackingNumber' | 'trackingUrl'
>

interface OrderListParams {
  q: string
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
    })
  }

  public listOrdersWithParams({ q, ...params }: OrderListParams) {
    const requets = this.http.get<OrderList>(routes.orders, {
      headers: {
        VtexIdClientAutCookie: this.context.authToken,
      },
      metric: 'oms-list-order-with-params',
      params: {
        q,
        ...params,
      },
    })

    return requets
  }

  public createInvoice(orderId: string, invoice: InputInvoiceFields) {
    return this.http.post<NotificationResponse>(
      routes.invoice(orderId),
      invoice,
      {
        headers: {
          VtexIdClientAutCookie: this.context.adminUserAuthToken || '',
        },
        metric: 'oms-create-invoice',
      }
    )
  }
}
