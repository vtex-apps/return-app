import type {
  QueryReturnRequestListArgs,
  ReturnRequestFilters,
  Maybe,
} from 'vtex.return-app'
import { ForbiddenError } from '@vtex/api'

const { VTEX_ACCOUNT } = process.env

const filterDate = (date: string): string => {
  const newDate = new Date(date)
  const day = newDate.getDate()
  const month = newDate.getMonth() + 1
  const year = newDate.getFullYear()

  return `${year}-${month < 10 ? `0${month}` : `${month}`}-${
    day < 10 ? `0${day}` : `${day}`
  }`
}

const buildWhereClause = (filter: Maybe<ReturnRequestFilters> | undefined) => {
  if (!filter) return

  const returnFilters = Object.entries(filter)
  const whereFilter = returnFilters.reduce((where, [key, value]) => {
    if (!value) return where

    if (where.length) {
      where += ` AND `
    }

    if (key === 'userId') {
      where += `customerProfileData.userId = "${value}"`

      return where
    }

    if (key === 'userEmail') {
      where += `customerProfileData.email = "${value}"`

      return where
    }

    if (key === 'createdIn' && typeof value !== 'string') {
      where += `dateSubmitted between ${filterDate(
        value.from
      )} AND ${filterDate(value.to)}`

      return where
    }

    where += `${key}=${value}`

    return where
  }, '')

  return whereFilter
}

export const returnRequestListService = async (
  ctx: Context,
  args: QueryReturnRequestListArgs,
  getAllFields = false
) => {
  const {
    clients: { returnRequest: returnRequestClient, marketplace },
    request: { header },
    state: { userProfile, appkey },
    vtex: { logger },
  } = ctx

  const { page, perPage, filter } = args
  const {
    userId: userIdProfile,
    email: userEmailProfile,
    role,
  } = userProfile ?? {}

  logger.info({
    service: 'get return request list',
    account: VTEX_ACCOUNT,
    vtexProduct: header['x-vtex-product'],
    args,
    state: {
      userProfile,
      isAdmin: Boolean(appkey),
    },
  })

  // vrn--vtexsphinx--aws-us-east-1--powerplanet--filarmamvp--link_vtex.return-app@3.5.0
  const isAppRequester = userEmailProfile?.includes('vtexsphinx') ?? false

  console.log({ userEmailProfile })

  const [, , , sellerRequester] =
    userEmailProfile && isAppRequester ? userEmailProfile.split('--') : []

  // avoid infinite loop on vtexspain
  // call marketplace
  const marketplaceRequests =
    // adapt marketplace.getRMAList to accept and send filter params
    VTEX_ACCOUNT === 'powerplanet' ? await marketplace.getRMAList() : null

  if (marketplaceRequests) {
    console.log({ marketplaceRequests })

    logger.info({
      service: 'marketplace response',
      account: VTEX_ACCOUNT,
      marketplaceRequests,
    })
  }

  const { userId: userIdArg, userEmail: userEmailArg } = filter ?? {}

  const userIsAdmin = Boolean(appkey) || role === 'admin'

  // only admin users can pass userId or userEmail in the request.
  // For non admin users, the userId or userEmail must be gotten from cookie session.
  // Otherwise, a non admin user could search for another user's return requests
  const userId = userIsAdmin ? userIdArg || userIdProfile : userIdProfile
  const userEmail = userIsAdmin
    ? userEmailArg || userEmailProfile
    : userEmailProfile

  // vtexProduct is undefined when coming from GraphQL IDE or from a external request
  const vtexProduct = header['x-vtex-product'] as 'admin' | 'store' | undefined

  // When the user is not admin or the request is coming from the store, we need to apply the user filter to get the right requests
  const requireFilterByUser =
    !userIsAdmin || vtexProduct === 'store' || role === 'store-user'

  const hasUserIdOrEmail = Boolean(userId || userEmail)

  if (requireFilterByUser && !hasUserIdOrEmail) {
    throw new ForbiddenError('Missing params to filter by store user')
  }

  const adjustedFilter =
    // require user info (store user calling) AND is not a sellerCalling (seller is not admin)
    requireFilterByUser && !sellerRequester
      ? { ...filter, userId, userEmail }
      : filter

  const resultFields = getAllFields
    ? ['_all']
    : [
        'id',
        'orderId',
        'sequenceNumber',
        'createdIn',
        'status',
        'dateSubmitted',
      ]

  const whereFilter = buildWhereClause(adjustedFilter)

  const whereWithSeller = whereFilter?.length
    ? `${whereFilter} AND items.sellerId=${sellerRequester}`
    : `items.sellerId=${sellerRequester}`

  console.log({ whereWithSeller, sellerRequester })

  const rmaSearchResult = await returnRequestClient.searchRaw(
    {
      page,
      pageSize: perPage && perPage <= 100 ? perPage : 25,
    },
    resultFields,
    'dateSubmitted DESC',
    sellerRequester ? whereWithSeller : whereFilter
  )

  const { data, pagination } = rmaSearchResult
  const { page: currentPage, pageSize, total } = pagination

  const finalList = marketplaceRequests
    ? [...marketplaceRequests.list, ...data]
    : data

  return {
    list: finalList,
    paging: {
      total,
      perPage: pageSize,
      currentPage,
      pages: Math.ceil(total / pageSize),
    },
  }
}
