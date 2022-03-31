import { deleteReturnRequest } from './deleteReturnRequest'
import { createReturnRequest } from './createReturnRequest'
import {
  queries as settingsQuery,
  mutations as settingsMutation,
} from './appSettings'
import { categoryTreeName } from './categoryTreeName'
import { ordersAvailableToReturn } from './ordersAvailableToReturn'

export const mutations = {
  deleteReturnRequest,
  createReturnRequest,
  ...settingsMutation,
}
export const queries = {
  ...settingsQuery,
  categoryTreeName,
  ordersAvailableToReturn,
}
