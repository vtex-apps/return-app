import type { ClientsConfig, ServiceContext, RecorderState } from '@vtex/api'
import { Service, method, LRUCache } from '@vtex/api'

import { Clients } from './clients'
import { returnAppGetSchemas } from './middlewares/returnAppGetSchemas'
import { generateReturnsSchema } from './middlewares/generateReturnsSchema'
import { receiveDocuments } from './middlewares/receiveDocuments'
import { getRequests } from './middlewares/getRequests'
import { receiveCategories } from './middlewares/receiveCategories'
import { saveMasterdataDocuments } from './middlewares/saveMasterdataDocuments'
import { saveMasterdataPartialDocuments } from './middlewares/saveMasterdataPartialDocuments'
import { createGiftCard } from './middlewares/createGiftCard'
import { updateGiftCard } from './middlewares/updateGiftCard'
import { getOrders } from './middlewares/getOrders'
import { getOrder } from './middlewares/getOrder'
import { getGiftCard } from './middlewares/getGiftCard'
import { getSkuById } from './middlewares/getSkuById'
import { sendMail } from './middlewares/sendMail'
import { getRequest } from './middlewares/api/getRequest'
import { getList } from './middlewares/api/getList'
import { addComment } from './middlewares/api/addComment'
import { verifyPackage } from './middlewares/api/verifyPackage'
import { changeProductStatus } from './middlewares/api/changeProductStatus'
import { checkStatus } from './middlewares/api/checkStatus'
import { updateStatus } from './middlewares/api/updateStatus'
import { createRefund } from './middlewares/createRefund'
import { errorHandler } from './middlewares/errorHandler'
import { mutations } from './resolvers'

const TIMEOUT_MS = 5000
const memoryCache = new LRUCache<string, any>({ max: 5000 })

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
    status: {
      memoryCache,
    },
  },
}

declare global {
  type Context = ServiceContext<Clients, State>

  type State = RecorderState
}

export default new Service({
  clients,
  routes: {
    getSchemas: method({
      GET: [errorHandler, returnAppGetSchemas],
    }),
    generateSchema: method({
      PUT: [errorHandler, generateReturnsSchema],
    }),
    getDocuments: method({
      GET: [errorHandler, receiveDocuments],
    }),
    getRequests: method({
      GET: [errorHandler, getRequests],
    }),
    getCategories: method({
      GET: [errorHandler, receiveCategories],
    }),
    getOrders: method({
      GET: [errorHandler, getOrders],
    }),
    getOrder: method({
      GET: [errorHandler, getOrder],
    }),
    saveDocuments: method({
      POST: [errorHandler, saveMasterdataDocuments],
    }),
    savePartialDocument: method({
      POST: [errorHandler, saveMasterdataPartialDocuments],
    }),
    createGiftCard: method({
      POST: [errorHandler, createGiftCard],
    }),
    updateGiftCard: method({
      POST: [errorHandler, updateGiftCard],
    }),
    getGiftCard: method({
      GET: [errorHandler, getGiftCard],
    }),
    getSkuById: method({
      GET: [errorHandler, getSkuById],
    }),
    sendMail: method({
      POST: [errorHandler, sendMail],
    }),
    apiGetRequest: method({
      GET: [errorHandler, getRequest],
    }),
    apiGetList: method({
      GET: [errorHandler, getList],
    }),
    apiAddComment: method({
      POST: [errorHandler, addComment],
    }),
    apiVerifyPackage: method({
      POST: [errorHandler, verifyPackage],
    }),
    apiChangeProductStatus: method({
      POST: [errorHandler, changeProductStatus],
    }),
    apiCheckStatus: method({
      GET: [errorHandler, checkStatus],
    }),
    apiUpdateStatus: method({
      POST: [errorHandler, updateStatus],
    }),
    createRefund: method({
      POST: [errorHandler, createRefund],
    }),
  },
  graphql: {
    resolvers: {
      Mutation: {
        ...mutations,
      },
    },
  },
})
