export async function keepAlive(ctx: Context, next: () => Promise<any>) {
  const { logger } = ctx
  
  console.info('Keep Alive running', process.env.VTEX_APP_ID)

  // Log keep alive request using Dynatrace logger if available
  logger?.info('KeepAlive endpoint called with createLogger', {
    handler: 'keepAlive',
    appId: process.env.VTEX_APP_ID,
    account: ctx.vtex.account,
    workspace: ctx.vtex.workspace,
    method: ctx.method,
    path: ctx.path
  })

  ctx.status = 200
  ctx.body = 'Ok'

  ctx.set('Cache-Control', 'no-cache')

  logger?.debug('KeepAlive response sent', {
    handler: 'keepAlive',
    status: ctx.status,
    cacheControl: 'no-cache'
  })

  // Add more log level examples
  logger?.warn('KeepAlive warning example', {
    message: 'This is a test warning - always visible',
    timestamp: new Date().toISOString()
  })

  logger?.error('KeepAlive error example', {
    message: 'This is a test error - always visible', 
    errorCode: 'TEST_ERROR'
  })

  await next()
}