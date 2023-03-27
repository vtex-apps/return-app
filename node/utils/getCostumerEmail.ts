import type { ClientProfileDetail } from '@vtex/clients'
import type { Logger } from '@vtex/api'
import { ResolverError } from '@vtex/api'

/**
 * Why not ALWAYS using email for userProfile?
 * userProfile is parsed from session cookie or created when a request is made using AuthCookie token.
 * When submitting a request via GraphQL IDE or calling the endpoint using APP-KEY and APP-TOKEN, we don't have the userProfile.
 * Also, we cannot use the email in the order because it might be masked.
 */
export const getCustomerEmail = (
  clientProfileData: ClientProfileDetail,
  {
    userProfile,
    appkey,
    inputEmail,
  }: {
    userProfile?: UserProfile
    appkey?: string
    /**
     * Email sent via args, either via GraphQL or request body in REST
     * @type {string}
     */
    inputEmail?: string | null
  },
  {
    logger,
  }: {
    logger: Logger
  }
): string => {
  const requesterIsStoreUser =
  clientProfileData.userProfileId === userProfile?.userId

  // when the requester is the owner of the order, we can use the email parsed from the session cookie
  if (userProfile && requesterIsStoreUser) return userProfile.email

  // Case: Request made by an admin user for a store user (e.g. via GraphQL IDE or endpoint using auth cookie)
  if (userProfile && userProfile.role === 'admin' && !requesterIsStoreUser) {
    if (!inputEmail) {
      throw new ResolverError(
        'Missing Store user email. Store user email is required when using admin user makes the request',
        400
      )
    }

    return inputEmail
  }

  // When the request is made via integration using the endpoint, store user email is a required param.
  if (appkey) {
    if (!inputEmail) {
      throw new ResolverError(
        'Missing Store user email. Store user email is required when using appkey',
        400
      )
    }

    return inputEmail
  }

  logger.error({
    message: 'Could not parse store user email',
    params: {
      customerOrderId: clientProfileData.userProfileId,
      appkey,
      inputEmail,
      userProfile,
    },
  })

  throw new ResolverError('Missing costumer email', 400)
}
