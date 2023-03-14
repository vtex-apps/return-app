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
import { getExtraSettings } from './middlewares/getExtraSettings'
import { mutations } from './resolvers'
import { auth } from './middlewares/auth'
import { adminAccess } from './middlewares/adminAccess'

const TIMEOUT_MS = 20000
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

  interface UserProfile {
    email: string
    userId: string
    firstName?: string
    lastName?: string
    role: 'admin' | 'store-user'
  }

  interface State extends RecorderState {
    // Added in the state via graphql directive or auth middleware when request has vtexidclientautcookie
    userProfile?: UserProfile
    // Added in the state via auth middleware when request has appkey and apptoken.
    appkey?: string
  }
}

export default new Service({
  clients,
  routes: {
    getSchemas: method({
      GET: [errorHandler, auth, adminAccess, returnAppGetSchemas],
    }),
    generateSchema: method({
      PUT: [errorHandler, auth, adminAccess, generateReturnsSchema],
    }),
    getDocuments: method({
      GET: [errorHandler, auth, receiveDocuments],
    }),
    getRequests: method({
      GET: [errorHandler, auth, getRequests],
    }),
    getCategories: method({
      GET: [errorHandler, auth, receiveCategories],
    }),
    getOrders: method({
      GET: [errorHandler, auth, getOrders],
    }),
    getOrder: method({
      GET: [errorHandler, auth, getOrder],
    }),
    saveDocuments: method({
      POST: [errorHandler, auth, saveMasterdataDocuments],
    }),
    savePartialDocument: method({
      POST: [errorHandler, auth, saveMasterdataPartialDocuments],
    }),
    createGiftCard: method({
      POST: [errorHandler, auth, adminAccess, createGiftCard],
    }),
    updateGiftCard: method({
      POST: [errorHandler, auth, adminAccess, updateGiftCard],
    }),
    getGiftCard: method({
      GET: [errorHandler, auth, getGiftCard],
    }),
    getSkuById: method({
      GET: [errorHandler, auth, getSkuById],
    }),
    sendMail: method({
      POST: [errorHandler, auth, adminAccess, sendMail],
    }),
    apiGetRequest: method({
      GET: [errorHandler, auth, adminAccess, getRequest],
    }),
    apiGetList: method({
      GET: [errorHandler, auth, adminAccess, getList],
    }),
    apiAddComment: method({
      POST: [errorHandler, auth, adminAccess, addComment],
    }),
    apiVerifyPackage: method({
      POST: [errorHandler, auth, adminAccess, verifyPackage],
    }),
    apiChangeProductStatus: method({
      POST: [errorHandler, auth, adminAccess, changeProductStatus],
    }),
    apiCheckStatus: method({
      GET: [errorHandler, auth, adminAccess, checkStatus],
    }),
    apiUpdateStatus: method({
      POST: [errorHandler, auth, adminAccess, updateStatus],
    }),
    createRefund: method({
      POST: [errorHandler, auth, adminAccess, createRefund],
    }),
    getExtraSettings: method({
      GET: [errorHandler, auth, adminAccess, getExtraSettings],
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
