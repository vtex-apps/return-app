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
    clients: { marketplace },
  } = ctx

  const authCookie = header.vtexidclientautcookie as string | undefined
  const appkey = header['x-vtex-api-appkey'] as string | undefined
  const apptoken = header['x-vtex-api-apptoken'] as string | undefined

  const { _sellerName, _sellerId } = query

  const body = await json(req)

  const { settings, sellerName } = body
  let seller = ''
  const sellerNameSettintgs = settings?.sellerId

  seller = sellerNameSettintgs || sellerName
  const { sellerId } = params as { sellerId: string }

  if (
    (authCookie || appkey || apptoken) &&
    (_sellerName || _sellerId || seller || sellerId || body.sellerId)
  ) {
    const accountName = String(
      _sellerName || _sellerId || seller || sellerId || body.sellerId
    )

    const { items } = await marketplace.getSellers(accountName)

    if (items.length > 0) {
      const currentSeller = items.find(
        (item: any) =>
          item?.id === accountName ||
          item?.account === accountName ||
          item?.name === accountName
      )

      if (!currentSeller) {
        throw new AuthenticationError(
          `The ${accountName} account does not exist.`
        )
      }

      if (!currentSeller.isActive) {
        throw new AuthenticationError(`The ${accountName} account is inactive.`)
      }

      ctx.state.sellerId = currentSeller.id
      ctx.body = body

      await next()
    } else {
      throw new AuthenticationError(
        'An error occurred while trying to validate your sellerId, please try again.'
      )
    }
  } else {
    throw new AuthenticationError('_sellerName or _sellerId is required.')
  }
}
