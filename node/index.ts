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
import { exportRequests } from './middlewares/exportRequests'
import { ping } from './middlewares/ping'
import setupScheduler from './events/keepAlive'
import { createGoodwill } from './middlewares/goodwill/createGoodwill'
import { getGoodwills } from './middlewares/goodwill/getGoodwills'
import { setSchemaVersion } from './middlewares/setSchema'

const {
  auth,
  authSelf,
  createReturn,
  getRequest,
  getRequestList,
  updateRequestStatus,
  saveAppSetting,
  returnAppSetting,
  saveSellerSetting,
  returnSellerSetting,
  sellerValidation,
  getOrdersList,
  createGiftcard,
  createPrerefund,
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
    sellerId?: string
  }
}

export default new Service<Clients, State, ParamsContext>({
  clients,
  events: {
    keepALive: setupScheduler,
  },
  routes: {
    returnRequests: method({
      POST: [setSchemaVersion, errorHandler, auth, sellerValidation, createReturn],
      GET: [setSchemaVersion, errorHandler, auth, sellerValidation, getRequestList],
    }),
    returnRequest: method({
      GET: [setSchemaVersion, errorHandler, auth, getRequest],
      PUT: [setSchemaVersion, errorHandler, auth, updateRequestStatus],
    }),
    exportRequests: method({
      GET: [setSchemaVersion, errorHandler, authSelf, exportRequests],
    }),
    goodwill: method({
      POST: [setSchemaVersion, setSchemaVersion, errorHandler, auth, sellerValidation, createGoodwill],
      GET: [setSchemaVersion, setSchemaVersion, errorHandler, auth, sellerValidation, getGoodwills],
    }),
    preRefund: method({
      GET: [setSchemaVersion, errorHandler, auth, createPrerefund],
    }),
    settings: method({
      POST: [setSchemaVersion, errorHandler, auth, saveAppSetting],
      PUT: [setSchemaVersion, errorHandler, auth, saveAppSetting],
      GET: [setSchemaVersion, errorHandler, auth, returnAppSetting],
    }),
    sellerSetting: method({
      POST: [setSchemaVersion, errorHandler, auth, sellerValidation, saveSellerSetting],
    }),
    sellerSettings: method({
      GET: [setSchemaVersion, errorHandler, auth, sellerValidation, returnSellerSetting],
    }),
    orderList: method({
      POST: [setSchemaVersion, errorHandler, auth, sellerValidation, getOrdersList],
    }),
    giftcard: method({
      POST: [errorHandler, auth, createGiftcard],
    }),
    ping: method({
      POST: [ping],
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
