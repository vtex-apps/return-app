import { SCHEMAS } from "./constants"


interface ContextFunction<T> {
  (_: any, params: any, ctx: Context): Promise<T>
}

export const wrapperFunction = <T>(originalFunction: ContextFunction<T>) => {
  return async (_: any, params: any, ctx: Context): Promise<T> => {
    ctx.clients.returnRequest.schema = SCHEMAS.DEFAULT
    ctx.clients.goodwill.schema = SCHEMAS.DEFAULT
    ctx.clients.sellerSetting.schema = SCHEMAS.DEFAULT
    ctx.clients.orderRefundDetails.schema = SCHEMAS.DEFAULT

    const result = await originalFunction(_, params, ctx)

    return result
  }
}

export const resolversWrapper = (items: {
  [key: string]: (...args: any[]) => any
}) =>
  Object.fromEntries(
    Object.entries(items).map(([name, originalFunction]) => {
      return [name, wrapperFunction(originalFunction)]
    })
  )
