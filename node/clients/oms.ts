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

export class OMSCustom extends OMS {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      headers: {
        VtexIdClientAutCookie: ctx.adminUserAuthToken ?? ctx.authToken,
      },
    })
  }

  public listOrdersWithParams(params?: string) {
    return this.http.get<OrderList>(`${routes.orders}?${params}`, {
      metric: 'oms-list-order-with-params',
    })
  }

  public createInvoice(orderId: string, invoice: InputInvoiceFields) {
    return this.http.post<NotificationResponse>(
      routes.invoice(orderId),
      invoice,
      {
        metric: 'oms-create-invoice',
      }
    )
  }
}
