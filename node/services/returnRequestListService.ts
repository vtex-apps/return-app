import type {
  QueryReturnRequestListArgs,
  ReturnRequestFilters,
  Maybe,
} from 'vtex.return-app'
import { ForbiddenError } from '@vtex/api'

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

    if (key === 'sellerName') {
      where += `sellerName = "${value}"`

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
    clients: { returnRequest: returnRequestClient },
    request: { header },
    state: { userProfile, appkey },
  } = ctx

  const { page, perPage, filter } = args
  const {
    userId: userIdProfile,
    email: userEmailProfile,
    role,
  } = userProfile ?? {}

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

  const adjustedFilter = requireFilterByUser
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
        'sellerName',
      ]

  const rmaSearchResult = await returnRequestClient.searchRaw(
    {
      page,
      pageSize: perPage && perPage <= 100 ? perPage : 25,
    },
    resultFields,
    'dateSubmitted DESC',
    buildWhereClause(adjustedFilter)
  )

  const { data, pagination } = rmaSearchResult
  const { page: currentPage, pageSize, total } = pagination

  return {
    list: data,
    paging: {
      total,
      perPage: pageSize,
      currentPage,
      pages: Math.ceil(total / pageSize),
    },
  }
}
