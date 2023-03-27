import { json } from 'co-body'
import { AuthenticationError } from '@vtex/api'

export async function sellerValidation(
  ctx: Context,
  next: () => Promise<void>
) {
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

  const body = await json(req)

  const { settings, sellerName } = body
  let seller = ''
  const sellerNameSettintgs = settings?.sellerId

  seller = sellerNameSettintgs || sellerName
  const { sellerId } = params as { sellerId: string }

  if (authCookie && (_sellerName || seller || sellerId)) {
    const accountName = String(_sellerName || seller || sellerId)
    const account = await vtexId.getAccount(authCookie, accountName)

    if (account.accountName !== accountName) {
      throw new AuthenticationError('Request failed with status code 401')
    }

    ctx.body = body

    await next()
  } else {
    throw new AuthenticationError('Request failed with status code 401')
  }
}
