import { deleteReturnRequest } from './deleteReturnRequest'
import { createReturnRequest } from './createReturnRequest'
import {
  queries as settingsQuery,
  mutations as settingsMutation,
} from './appSettings'
import { categoryTreeName } from './categoryTreeName'
import { ordersAvailableToReturn } from './ordersAvailableToReturn'
import { orderToReturnSummary } from './orderToReturnSummary'
import { returnRequest } from './returnRequest'
import { returnRequestList } from './returnRequestList'

export const mutations = {
  deleteReturnRequest,
  createReturnRequest,
  ...settingsMutation,
}
export const queries = {
  ...settingsQuery,
  categoryTreeName,
  ordersAvailableToReturn,
  orderToReturnSummary,
  returnRequest,
  returnRequestList,
}
