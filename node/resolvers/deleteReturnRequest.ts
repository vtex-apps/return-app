export const deleteReturnRequest = async (
  _: unknown,
  args: { Id: string[] },
  ctx: Context
) => {
  const { Id } = args
  const {
    clients: { mdFactory },
  } = ctx

  const promises = Id.map((id) => {
    return mdFactory.deleteRMADocument(id)
  })

  await Promise.all(promises)

  return true
}
