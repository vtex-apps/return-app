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
import { returnSettingsList } from './returnSettingsList'
import { ReturnRequestResponse } from './ReturnRequestResponse'
import { updateReturnRequestStatus } from './updateReturnRequestStatus'
import { nearestPickupPoints } from './nearestPickupPoints'
import { returnSellerSettings } from './returnSellerSettings'
import { updateSellerSetting } from './updateSellerSetting'

export const mutations = {
  createReturnRequest,
  updateReturnRequestStatus,
  updateSellerSetting,
  ...settingsMutation,
}

export const queries = {
  ...settingsQuery,
  returnSellerSettings,
  categoryTreeName,
  ordersAvailableToReturn,
  orderToReturnSummary,
  returnRequest,
  returnRequestList,
  nearestPickupPoints,
  returnSettingsList,
}

export const resolvers = { ReturnRequestResponse }
