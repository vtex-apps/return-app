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

const buildWhereClause = (
  filter: Maybe<ReturnRequestFilters> | undefined,
  userId?: string
) => {
  const userFilter = userId && `customerProfileData.userId = "${userId}"`

  if (!filter) return userFilter

  const returnFilters = Object.entries(filter)
  const whereFilter = returnFilters.reduce((where, [key, value]) => {
    if (!value) return where

    if (where.length) {
      where += ` AND `
    }

    if (key === 'createdIn' && typeof value !== 'string') {
      where += `${key} between ${filterDate(value.from)} AND ${filterDate(
        value.to
      )}`

      return where
    }

    where += `${key}=${value}`

    return where
  }, '')

  return userFilter ? `${userFilter} AND ${whereFilter}` : whereFilter
}

export const returnRequestList = async (
  _: unknown,
  args: QueryReturnRequestListArgs,
  ctx: Context
) => {
  const {
    clients: { returnRequest: returnRequestClient },
    request: { header },
    state: { userProfile, appkey },
  } = ctx

  const { page, filter } = args
  const { userId, role } = userProfile ?? {}

  // vtexProduct is undefined when coming from GraphQL IDE
  const vtexProduct = header['x-vtex-product'] as 'admin' | 'store' | undefined

  // This is useful to apply user filter when an admin is impersonating a store user.
  const filterUser =
    vtexProduct === 'store' || role === 'store-user' ? userId : undefined

  const userIsAdmin = Boolean(appkey) ?? role === 'admin'

  // If user is not admin it's necessary to filter the query by userId
  if (!userIsAdmin && !filterUser) {
    throw new ForbiddenError('User cannot access this request')
  }

  const rmaSearchResult = await returnRequestClient.searchRaw(
    {
      page,
      pageSize: 25,
    },
    [
      'id',
      'orderId',
      'sequenceNumber',
      'createdIn',
      'status',
      'dateSubmitted',
      'userComment',
    ],
    'createdIn DESC',
    buildWhereClause(filter, filterUser)
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
