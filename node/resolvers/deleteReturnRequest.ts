export const deleteReturnRequest = async (
  _: unknown,
  args: { Id: string[] },
  ctx: Context
) => {
  const { Id } = args
  const {
    clients: { masterdata },
  } = ctx

  const promises = Id.map((id) => {
    return masterdata.deleteDocument({ id, dataEntity: 'ReturnApp' })
  })

  await Promise.all(promises)

  // Hard coded data entity name. Later, we should take it to a constant file.
  // Not doing now to avoid confusion with other constant files

  return true
}
