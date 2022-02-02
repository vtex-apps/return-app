export const deleteReturnRequest = async (
  _: unknown,
  args: { id: string },
  ctx: Context
) => {
  const { id } = args
  const {
    clients: { masterdata },
  } = ctx

  // Hard coded data entity name. Later, we should take it to a constant file.
  // Not doing now to avoid confusion with other constant files
  await masterdata.deleteDocument({ id, dataEntity: 'ReturnApp' })

  return true
}
