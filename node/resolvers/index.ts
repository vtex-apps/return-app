import { deleteReturnRequest } from './deleteReturnRequest'
import { createReturnRequest } from './createReturnRequest'
import { nearestPickupPoints } from './checkout'

export const queries = { nearestPickupPoints }

export const mutations = { deleteReturnRequest, createReturnRequest }
