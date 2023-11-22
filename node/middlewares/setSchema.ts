import { SCHEMAS } from "../utils/constants"

export async function setSchemaVersion(
  ctx: Context,
  next: () => Promise<any>
): Promise<any> {
  ctx.clients.returnRequest.schema = SCHEMAS.DEFAULT
  ctx.clients.goodwill.schema = SCHEMAS.DEFAULT
  ctx.clients.sellerSetting.schema = SCHEMAS.DEFAULT
  ctx.clients.orderRefundDetails.schema = SCHEMAS.DEFAULT
  await next()
}
