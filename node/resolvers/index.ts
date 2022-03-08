import { deleteReturnRequest as deleteReturnRequestResolver } from './deleteReturnRequest'
import { createReturnRequest as createReturnRequestResolver } from './createReturnRequest'
import { getProfileEmailAndId } from '../middlewares/getProfileEmailAndId'

type DeleteReturnRequestParameters = Parameters<
  typeof deleteReturnRequestResolver
>
type CreateReturnRequestParameters = Parameters<
  typeof createReturnRequestResolver
>

const deleteReturnRequest = async (...args: DeleteReturnRequestParameters) => {
  const ctx: Context = args[2]

  await getProfileEmailAndId(ctx, () => {
    return Promise.resolve()
  })

  return await deleteReturnRequestResolver(...args)
}

const createReturnRequest = async (...args: CreateReturnRequestParameters) => {
  const ctx: Context = args[2]

  await getProfileEmailAndId(ctx, () => {
    return Promise.resolve()
  })

  return await createReturnRequestResolver(...args)
}

export const mutations = {
  deleteReturnRequest,
  createReturnRequest,
}
