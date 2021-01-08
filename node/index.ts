import {ClientsConfig, Service, ServiceContext, method, LRUCache, RecorderState} from '@vtex/api'

import { Clients } from './clients'
import { returnAppGetSchemas } from './middlewares/returnAppGetSchemas'
import { generateReturnsSchema } from './middlewares/generateReturnsSchema'
import { receiveDocuments } from './middlewares/receiveDocuments'
import { receiveCategories } from './middlewares/receiveCategories'
import { saveMasterdataDocuments } from './middlewares/saveMasterdataDocuments'
import { updateMasterdataDocuments } from './middlewares/updateMasterdataDocuments'
import { sendMail } from './middlewares/sendMail'

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
      memoryCache
    }
  },
}

declare global {
  type Context = ServiceContext<Clients, State>

  interface State extends RecorderState {}
}

export default new Service({
  clients,
  routes: {
    getSchemas: method({
      GET: returnAppGetSchemas
    }),
    generateSchema: method({
      PUT: generateReturnsSchema
    }),
    getDocuments: method({
      GET: receiveDocuments
    }),
    getCategories: method({
      GET: receiveCategories
    }),
    saveDocuments: method({
      POST: saveMasterdataDocuments
    }),
    updateDocuments: method({
      PUT: updateMasterdataDocuments
    }),
    sendMail: method({
      POST: sendMail
    }),
  },
})
