import type {
  ClientsConfig,
  ServiceContext,
  RecorderState,
  ParamsContext,
} from '@vtex/api'
import { Service, method, LRUCache } from '@vtex/api'

import { Clients } from './clients'
import { errorHandler } from './middlewares/errorHandler'
import { mutations, queries, resolvers } from './resolvers'
import { schemaDirectives } from './directives'
import { auth } from './middlewares/auth'
import { createReturn } from './middlewares/createReturn'
import { getRequest } from './middlewares/getRequest'
import { getRequestList } from './middlewares/getRequestList'
import { updateRequestStatus } from './middlewares/updateRequestStatus'

const TIMEOUT_MS = 5000
const catalogMemoryCache = new LRUCache<string, any>({ max: 5000 })

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
    catalog: {
      memoryCache: catalogMemoryCache,
    },
  },
}

declare global {
  type Context = ServiceContext<Clients, State>

  interface State extends RecorderState {
    // Added in the state via graphql directive or auth middleware when request has vtexidclientautcookie
    userProfile?: UserProfile
    // Added in the state via auth middleware when request has appkey and apptoken.
    appkey?: string
  }
}

export default new Service<Clients, State, ParamsContext>({
  clients,
  routes: {
    returnRequests: method({
      POST: [errorHandler, auth, createReturn],
      GET: [errorHandler, auth, getRequestList],
    }),
    returnRequest: method({
      GET: [errorHandler, auth, getRequest],
      PUT: [errorHandler, auth, updateRequestStatus],
    }),
  },
  graphql: {
    resolvers: {
      ...resolvers,
      Mutation: {
        ...mutations,
      },
      Query: {
        ...queries,
      },
    },
    schemaDirectives: {
      ...schemaDirectives,
    },
  },
})
