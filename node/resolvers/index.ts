import { nearestPickupPoints } from './checkout'
import { deleteReturnRequest } from './deleteReturnRequest'
import { createReturnRequest } from './createReturnRequest'

export const queries = { nearestPickupPoints }

export const mutations = { deleteReturnRequest, createReturnRequest }
