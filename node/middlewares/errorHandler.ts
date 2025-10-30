import { CommonLogger } from '../utils/commonLogger'

export async function errorHandler(ctx: Context, next: () => Promise<void>) {
  try {
    await next()
  } catch (error) {
    // Log error with full VTEX context
    CommonLogger.logError(ctx, error, ctx.path, {
      statusCode: error.status || error.response?.status || 500,
      errorType: error.name || 'UnknownError'
    }, { 
      file: 'middlewares/errorHandler.ts', 
      function: 'errorHandler' 
    })

    ctx.status = error.status || error.response?.status || 500
    ctx.body = { error: error.message }
    ctx.app.emit('error', error, ctx)
  }
}
