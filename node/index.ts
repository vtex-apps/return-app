import type {
  ClientsConfig,
  ServiceContext,
  RecorderState,
  ParamsContext,
} from '@vtex/api'
import { Service, method, LRUCache } from '@vtex/api'

import { Clients } from './clients'
import { errorHandler } from './middlewares/errorHandler'
import { setupLogger } from './middlewares/setupLogger'
import { mutations, queries, resolvers } from './resolvers'
import { schemaDirectives } from './directives'
import { auth } from './middlewares/auth'
import { keepAlive } from './middlewares/keepAlive'
import { createReturn } from './middlewares/createReturn'
import { getRequest } from './middlewares/getRequest'
import { getRequestList } from './middlewares/getRequestList'
import { updateRequestStatus } from './middlewares/updateRequestStatus'
import { updateRequestAdditionalInfo } from './middlewares/updateRequestAdditionalInfo'
import { getRequestAdditionalInfo } from './middlewares/getRequestAdditionalInfo'
import { getAdjustment } from './middlewares/getAdjustment'
import { getAdjustmentList } from './middlewares/getAdjustmentList'
import { createAdjustment } from './middlewares/createAdjustment'
import { updateAdjustmentStatus } from './middlewares/updateAdjustmentStatus'
import { getAdjustmentAdditionalInfo } from './middlewares/getAdjustmentAdditionalInfo'
import { updateAdjustmentAdditionalInfo } from './middlewares/updateAdjustmentAdditionalInfo'
import { orderDataStats } from './middlewares/orderDataStats'

const TIMEOUT_MS = 5000
const catalogMemoryCache = new LRUCache<string, any>({ max: 5000 })

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
    events: {
      exponentialBackoffCoefficient: 2,
      initialBackoffDelay: 120,
      retries: 3,
      timeout: TIMEOUT_MS,
    },
    catalog: {
      memoryCache: catalogMemoryCache,
    },
  },
}

declare global {
  type Context = ServiceContext<Clients, State> & {
    logger?: any // Dynatrace logger instance from setupLogger middleware
  }

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
      POST: [setupLogger, errorHandler, auth, createReturn],
      GET: [setupLogger, errorHandler, auth, getRequestList],
    }),
    returnRequest: method({
      GET: [setupLogger, errorHandler, auth, getRequest],
      PUT: [setupLogger, errorHandler, auth, updateRequestStatus],
    }),
    returnRequestAdditionalInfo: method({
      GET: [setupLogger, errorHandler, auth, getRequestAdditionalInfo],
      PUT: [setupLogger, errorHandler, auth, updateRequestAdditionalInfo],
    }),
    adjustmentNotes: method({
      GET: [setupLogger, errorHandler, auth, getAdjustmentList],
      POST: [setupLogger, errorHandler, auth, createAdjustment],
    }),
    adjustmentNote: method({
      GET: [setupLogger, errorHandler, auth, getAdjustment],
      PUT: [setupLogger, errorHandler, auth, updateAdjustmentStatus],
    }),
    adjustmentNoteAdditionalInfo: method({
      GET: [setupLogger, errorHandler, auth, getAdjustmentAdditionalInfo],
      PUT: [setupLogger, errorHandler, auth, updateAdjustmentAdditionalInfo],
    }),
    keepAlive: method({
      GET: [setupLogger, keepAlive],
    }),
    orderDataStats: method({
      GET: [setupLogger, errorHandler, auth, orderDataStats],
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
