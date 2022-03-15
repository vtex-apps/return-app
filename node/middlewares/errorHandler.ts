export async function errorHandler(ctx: Context, next: () => Promise<void>) {
  const {
    vtex: { logger },
  } = ctx

  try {
    await next()
  } catch (error) {
    logger.error({
      message: error.message,
      error,
    })
  }
}
