import { json } from 'co-body'
import { AuthenticationError } from '@vtex/api'

export async function sellerValidation(ctx: Context, next: () => Promise<void>) {
  const {
    header,
    req,
    query,
    vtex: {
      route: { params },
    },
    clients: { vtexId },
  } = ctx

  const authCookie = header.vtexidclientautcookie as string | undefined

  const { _sellerName } = query

  const {sellerName} = await json(req)
  
  const { sellerId } = params as { sellerId: string }

  if(authCookie && (_sellerName || sellerName || sellerId) ){
    const accountName = _sellerName || sellerName || sellerId
    
    try {
      const account = await vtexId.getAccount(authCookie, accountName)
      
      if(!account){
        throw new AuthenticationError('Request failed with status code 401')
      }
    } catch (error) {
      throw new AuthenticationError('Request failed with status code 401')
    }
  }

  await next()
}
