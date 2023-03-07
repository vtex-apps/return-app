import { json } from 'co-body'
import { AuthenticationError } from '@vtex/api'

export async function sellerValidation(ctx: Context, next: () => Promise<void>) {
  const {
    req,
    header,
    query,
    vtex: {
      route: { params },
    }
  } = ctx

  const originAccount = header['x-vtex-origin-account'] as string | undefined

  const { _sellerName } = query

  const {sellerName} = await json(req)
  
  const { sellerId } = params as { sellerId: string }
  console.log('_sellerName: ', _sellerName)
  console.log('sellerName: ', sellerName)
  console.log('sellerId: ', sellerId)
  if(_sellerName !== originAccount && sellerName !== originAccount && sellerId !== originAccount || !originAccount){
    throw new AuthenticationError('Request failed with status code 401')
  }

  await next()
}
