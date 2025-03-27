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
import { ReturnRequestResponse } from './ReturnRequestResponse'
import { updateReturnRequestStatus } from './updateReturnRequestStatus'
import { nearestPickupPoints } from './nearestPickupPoints'

export const mutations = {
  createReturnRequest,
  updateReturnRequestStatus,
  ...settingsMutation,
}

export const queries = {
  ...settingsQuery,
  categoryTreeName,
  ordersAvailableToReturn,
  orderToReturnSummary,
  returnRequest,
  returnRequestList,
  nearestPickupPoints,
}

export const resolvers = { ReturnRequestResponse }
