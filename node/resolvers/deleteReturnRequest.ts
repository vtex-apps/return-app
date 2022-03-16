export const deleteReturnRequest = async (
  _: unknown,
  args: { Id: string[] },
  ctx: Context
) => {
  const { Id } = args
  const {
    clients: { mdFactory },
    vtex: { logger },
  } = ctx

  const promises = Id.map((id) => {
    return mdFactory.deleteRMADocument(id)
  })

  try {
    const response = await Promise.all(promises)

    logger.info({
      message: `Return request documents deleted successfully`,
      data: response,
    })
  } catch (e) {
    logger.error({
      message: `Error deleting return request documents with IDs: ${Id}`,
      error: e,
      data: {
        ctx,
      },
    })
  }

  return true
}
