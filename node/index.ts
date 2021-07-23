import {
  ClientsConfig,
  Service,
  ServiceContext,
  method,
  LRUCache,
  RecorderState
} from "@vtex/api";

import { Clients } from "./clients";
import { returnAppGetSchemas } from "./middlewares/returnAppGetSchemas";
import { generateReturnsSchema } from "./middlewares/generateReturnsSchema";
import { receiveDocuments } from "./middlewares/receiveDocuments";
import { receiveCategories } from "./middlewares/receiveCategories";
import { saveMasterdataDocuments } from "./middlewares/saveMasterdataDocuments";
import { saveMasterdataPartialDocuments } from "./middlewares/saveMasterdataPartialDocuments";
import { createGiftCard } from "./middlewares/createGiftCard";
import { updateGiftCard } from "./middlewares/updateGiftCard";
import { getOrders } from "./middlewares/getOrders";
import { getOrder } from "./middlewares/getOrder";
import { getGiftCard } from "./middlewares/getGiftCard";
import { getSkuById } from "./middlewares/getSkuById";
import { sendMail } from "./middlewares/sendMail";
import { getRequest } from "./middlewares/api/getRequest";
import { getList } from "./middlewares/api/getList";
import { addComment } from "./middlewares/api/addComment";
import { changeProductStatus } from "./middlewares/api/changeProductStatus";
import { checkStatus } from "./middlewares/api/checkStatus";
import { updateStatus } from "./middlewares/api/updateStatus";
import {createRequest} from "./middlewares/api/createRequest";

import { isAuthenticated } from "./middlewares/auth";

const TIMEOUT_MS = 5000;
const memoryCache = new LRUCache<string, any>({ max: 5000 });

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS
    },
    status: {
      memoryCache
    }
  }
};

declare global {
  type Context = ServiceContext<Clients, State>;

  type State = RecorderState;
}

export default new Service({
  clients,
  routes: {
    getSchemas: method({
      GET: [isAuthenticated, returnAppGetSchemas]
    }),
    generateSchema: method({
      PUT: [isAuthenticated, generateReturnsSchema]
    }),
    getDocuments: method({
      GET: [isAuthenticated, receiveDocuments]
    }),
    getCategories: method({
      GET: [isAuthenticated, receiveCategories]
    }),
    getOrders: method({
      GET: [isAuthenticated, getOrders]
    }),
    getOrder: method({
      GET: [isAuthenticated, getOrder]
    }),
    saveDocuments: method({
      POST: [isAuthenticated, saveMasterdataDocuments]
    }),
    savePartialDocument: method({
      POST: [isAuthenticated, saveMasterdataPartialDocuments]
    }),
    createGiftCard: method({
      POST: [isAuthenticated, createGiftCard]
    }),
    updateGiftCard: method({
      POST: [isAuthenticated, updateGiftCard]
    }),
    getGiftCard: method({
      GET: [isAuthenticated, getGiftCard]
    }),
    getSkuById: method({
      GET: [isAuthenticated, getSkuById]
    }),
    sendMail: method({
      POST: [isAuthenticated, sendMail]
    }),
    apiGetRequest: method({
      GET: [isAuthenticated, getRequest]
    }),
    apiGetList: method({
      GET: [isAuthenticated, getList]
    }),
    apiAddComment: method({
      POST: [isAuthenticated, addComment]
    }),
    apiChangeProductStatus: method({
      POST: [isAuthenticated, changeProductStatus]
    }),
    apiCheckStatus: method({
      GET: [isAuthenticated, checkStatus]
    }),
    apiUpdateStatus: method({
      POST: [isAuthenticated, updateStatus]
    }),
    apiCreateRequest: method({
      POST: createRequest
    }),
  }
});
