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

  const {settings} = await json(req)
  const sellerName = settings?.sellerId
  
  const { sellerId } = params as { sellerId: string }

  if(authCookie && (_sellerName || sellerName || sellerId) ){
    const accountName = _sellerName || sellerName || sellerId

    try {
      const account = await vtexId.getAccount(authCookie, accountName)

      if(account.accountName != accountName){
        throw new AuthenticationError('Request failed with status code 401')
      }
      
      ctx.body = {
        settings
      }
      
      await next()
    } catch (error) {
      throw new AuthenticationError('Request failed with status code 401')
    }
  } else {
    throw new AuthenticationError('Request failed with status code 401')
  }

}
