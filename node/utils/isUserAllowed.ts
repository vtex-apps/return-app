import type { ClientProfileDetail } from '@vtex/clients'
import { ForbiddenError, ResolverError } from '@vtex/api'

export const isUserAllowed = ({
  requesterUser,
  clientProfile,
  appkey,
}: {
  requesterUser?: UserProfile
  clientProfile: ClientProfileDetail
  appkey?: string
}) => {
  // If appkey is in the request, it means that the request was authenticated with appkey and apptoken
  if (appkey) return

  // if appkey doesn't exist, we need a UserProfile
  if (!requesterUser) {
    throw new ResolverError('Missing User Profile data')
  }

  const { userId, role } = requesterUser
  const { userProfileId } = clientProfile

  const orderBelongsToUser = userId === userProfileId
  const userIsAdmin = role === 'admin'

  // User should only be able to see / use their order.
  if (!orderBelongsToUser && !userIsAdmin) {
    throw new ForbiddenError('User cannot access this order')
  }
}

export const isUserAdmin = ({
  requesterUser,
  appkey,
}: {
  requesterUser?: UserProfile
  appkey?: string
}) => {
  // If appkey is in the request, it means that the request was authenticated with appkey and apptoken
  if (appkey) return true

  // if appkey doesn't exist, we need a UserProfile
  if (!requesterUser) {
    throw new ResolverError('Missing User Profile data')
  }

  const { role } = requesterUser
  const userIsAdmin = role === 'admin'

  return userIsAdmin
}
