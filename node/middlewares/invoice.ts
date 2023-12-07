import { json } from "co-body"
import { createInvoice } from "../services/createInvoice"

export async function invoice(ctx: Context): Promise<any> {
  const {
    req,
    vtex: {
      route: {
        params: { orderId },
      },
    },
  } = ctx
  const body = await json(req)

  ctx.body = await createInvoice(ctx, orderId, body)

}
