import type { InstanceOptions, IOContext } from '@vtex/api'
import type { NotificationResponse, NotificationInput } from '@vtex/clients'
import { OMS } from '@vtex/clients'
import type {
  OrderDetailResponse,
  AddressDetail,
  ShippingDetail,
} from '@vtex/clients'

const baseURL = '/api/oms'

const routes = {
  orders: `${baseURL}/pvt/orders`,
  invoice: (orderId: string) => `${baseURL}/pvt/orders/${orderId}/invoice`,
}

export interface AddressDetailWithGeoCoordinates extends AddressDetail {
  geoCoordinates: number[]
}
export interface ShippingDetailWithGeoCoordinates extends ShippingDetail {
  address: AddressDetailWithGeoCoordinates
}
export interface OrderDetailResponseWithGeoCoordinates
  extends OrderDetailResponse {
  shippingData: ShippingDetailWithGeoCoordinates
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
        VtexIdClientAutCookie: ctx.adminUserAuthToken ?? ctx.authToken,
      },
    })
  }

  public listOrdersWithParams(params?: OrderListParams) {
    return this.http.get<OrderList>(routes.orders, {
      metric: 'oms-list-order-with-params',
      ...(params ? { params } : {}),
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
