import type { ClientProfileDetail } from '@vtex/clients'
import { ForbiddenError } from '@vtex/api'

export const isUserAllowed = ({
  requesterUser,
  clientProfile,
}: {
  requesterUser: UserProfile
  clientProfile: ClientProfileDetail
}) => {
  const { userId, role } = requesterUser
  const { userProfileId } = clientProfile

  const orderBelongsToUser = userId === userProfileId
  const userIsAdmin = role === 'admin'

  // User should only be able to see / use their order.
  if (!orderBelongsToUser && !userIsAdmin) {
    throw new ForbiddenError('User cannot access this order')
  }
}
