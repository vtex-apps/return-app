import { AuthenticationError } from '@vtex/api'

const schemaNames = {
  request: 'returnRequests',
  product: 'returnProducts',
  comment: 'returnComments',
  history: 'returnStatusHistory',
  settings: 'returnSettings',
  order: 'singleOrder',
  orders: 'orders',
}

interface UserGuardType {
  source: string
  identifier: string
}

/**
 * Avoid store-users from accessing sensitive data
 * @param schema resource access
 * @param config used to compare if the user has rights to access data
 */
export function storeUserGuard(resource: string, config: UserGuardType) {
  const { source, identifier } = config

  try {
    const allowedResource = Object.values(schemaNames).includes(resource)

    if (!allowedResource) {
      throw new Error()
    }

    // A store user can only get its own order
    if (resource === schemaNames.order && source !== identifier) {
      throw new Error()
    }

    // A store user can only retrieve its own list of orders
    if (resource === schemaNames.orders) {
      const paramClientEmail = source.match(/clientEmail=(.*?)(?=&|$)/)

      if (!paramClientEmail || paramClientEmail[1] !== identifier) {
        throw new Error()
      }
    }

    // A store user can only retrieve its own return requests
    if (resource === schemaNames.request) {
      const paramId = source.match(/id=(.*?)(?=__|$)/)
      const paramUserId = source.match(/userId=(.*?)(?=__|$)/)

      if (!paramUserId && !paramId) {
        throw new Error()
      }

      if (paramUserId && paramUserId[1] !== identifier) {
        throw new Error()
      }
    }
  } catch (error) {
    throw new AuthenticationError('Request failed with status code 401')
  }
}
