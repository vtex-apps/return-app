import { DynatraceLoggerFactory, LogLevel } from '@odp-ecom/js-logger'

export async function setupLogger(ctx: Context, next: () => Promise<any>) {
  try {
    // Get app settings from VTEX Admin
    const appSettings = await ctx.clients.apps.getAppSettings(
      `${process.env.VTEX_APP_VENDOR}.${process.env.VTEX_APP_NAME}@${process.env.VTEX_APP_VERSION}`
    )

    // Check if logging is enabled
    if (!appSettings.enableDynatraceLogging) {
      console.log('Dynatrace logging disabled in app settings')
      await next()
      return
    }

    // Validate token is configured
    if (!appSettings.dynatraceToken) {
      console.warn('Dynatrace token not configured. Please configure in VTEX Admin → Apps → Your App → Settings')
      await next()
      return
    }


    // Create logger with app-specific token
    // The js-logger package provides the endpoint, app provides the token
    const logLevelKey = appSettings.logLevel?.toUpperCase() as keyof typeof LogLevel
    const selectedLogLevel = logLevelKey && LogLevel[logLevelKey] ? LogLevel[logLevelKey] : LogLevel.INFO
    
    const logger = await DynatraceLoggerFactory.createLogger({
      environment: 'dev', // Pre-configured ODP Dynatrace endpoint
      source: `vtex-${process.env.VTEX_APP_NAME}`,
      apiToken: appSettings.dynatraceToken, // From VTEX Admin settings - secure!
      level: selectedLogLevel
    })

    // Add logger to context
    ctx.logger = logger
    
    // Note: Logger initialization successful (no need to log this on every request)

  } catch (error) {
    console.error('Failed to setup Dynatrace logger:', error)
    // Continue without logger rather than failing the request
  }

  await next()
}
