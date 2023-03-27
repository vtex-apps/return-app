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
import { middlewares } from './middlewares'

const {
  auth,
  createReturn,
  getRequest,
  getRequestList,
  updateRequestStatus,
  saveAppSetting,
  returnAppSetting,
  saveSellerSetting,
  returnSellerSetting,
  sellerValidation,
} = middlewares

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
      POST: [errorHandler, auth, sellerValidation, createReturn],
      GET: [errorHandler, auth, getRequestList],
    }),
    returnRequest: method({
      GET: [errorHandler, auth, getRequest],
      PUT: [errorHandler, auth, updateRequestStatus],
    }),
    settings: method({
      POST: [errorHandler, auth, saveAppSetting],
      GET: [errorHandler, auth, returnAppSetting],
    }),
    sellerSetting: method({
      POST: [errorHandler, auth, sellerValidation, saveSellerSetting],
    }),
    sellerSettings: method({
      GET: [errorHandler, auth, sellerValidation, returnSellerSetting],
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
