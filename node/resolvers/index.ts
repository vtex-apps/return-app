import { deleteReturnRequest } from './deleteReturnRequest'
import { createReturnRequest } from './createReturnRequest'
import { queries as settingsQuery } from './appSettings'

export const mutations = { deleteReturnRequest, createReturnRequest }
export const queries = { ...settingsQuery }
