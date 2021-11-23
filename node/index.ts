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
      GET: returnAppGetSchemas,
    }),
    generateSchema: method({
      PUT: generateReturnsSchema,
    }),
    getDocuments: method({
      GET: receiveDocuments,
    }),
    getRequests: method({
      GET: getRequests,
    }),
    getCategories: method({
      GET: receiveCategories,
    }),
    getOrders: method({
      GET: getOrders,
    }),
    getOrder: method({
      GET: getOrder,
    }),
    saveDocuments: method({
      POST: saveMasterdataDocuments,
    }),
    savePartialDocument: method({
      POST: saveMasterdataPartialDocuments,
    }),
    createGiftCard: method({
      POST: createGiftCard,
    }),
    updateGiftCard: method({
      POST: updateGiftCard,
    }),
    getGiftCard: method({
      GET: getGiftCard,
    }),
    getSkuById: method({
      GET: getSkuById,
    }),
    sendMail: method({
      POST: sendMail,
    }),
    apiGetRequest: method({
      GET: getRequest,
    }),
    apiGetList: method({
      GET: getList,
    }),
    apiAddComment: method({
      POST: addComment,
    }),
    apiVerifyPackage: method({
      POST: verifyPackage,
    }),
    apiChangeProductStatus: method({
      POST: changeProductStatus,
    }),
    apiCheckStatus: method({
      GET: checkStatus,
    }),
    apiUpdateStatus: method({
      POST: updateStatus,
    }),
    createRefund: method({
      POST: createRefund,
    }),
  },
})
