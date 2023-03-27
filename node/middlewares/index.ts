import { saveAppSetting, returnAppSetting } from './appSettings'
import { auth } from './auth'
import { createReturn } from './createReturn'
import { errorHandler } from './errorHandler'
import { getRequest } from './getRequest'
import { getRequestList } from './getRequestList'
import { updateRequestStatus } from './updateRequestStatus'
import { saveSellerSetting, returnSellerSetting } from './sellerSetting'
import { sellerValidation } from './sellerValidation'

export const middlewares = {
  saveAppSetting,
  returnAppSetting,
  auth,
  createReturn,
  errorHandler,
  getRequest,
  getRequestList,
  updateRequestStatus,
  saveSellerSetting,
  returnSellerSetting,
  sellerValidation,
}
