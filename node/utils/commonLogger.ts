/**
 * Common Logger for VTEX Backend
 * Standardizes logging with VTEX context metadata
 */

/**
 * Extracts common VTEX context for consistent logging
 */
function getVtexContext(ctx: Context, sourceLocation?: { file?: string, function?: string }) {
  // Create full VTEX app identifier
  const appIdentifier = `${process.env.VTEX_APP_VENDOR}.${process.env.VTEX_APP_NAME}`
  
  return {
    // Core VTEX Context
    account: ctx.vtex?.account,
    workspace: ctx.vtex?.workspace || process.env.VTEX_WORKSPACE,
    
    // App Context  
    appId: appIdentifier, // Full app identifier: 'odp.return-app'
    appName: process.env.VTEX_APP_NAME, // Just 'return-app'
    appVersion: process.env.VTEX_APP_VERSION,
    appVendor: process.env.VTEX_APP_VENDOR, // 'odp'
    
    // Source Location (for tracing)
    sourceFile: sourceLocation?.file,
    sourceFunction: sourceLocation?.function,
    
    // Request Context
    method: ctx.method,
    path: ctx.path,
    
    // User Context (when available)
    userId: ctx.state?.userProfile?.userId,
    userRole: ctx.state?.userProfile?.role,
    
    // Timestamp
    timestamp: new Date().toISOString(),
  }
}

/**
 * Common logging utilities for VTEX backend
 */
export const CommonLogger = {
  
  /**
   * Log API operations
   */
  logApiOperation(ctx: Context, operation: string, data?: any, sourceLocation?: { file?: string, function?: string }) {
    const { logger } = ctx
    logger?.info(`API: ${operation}`, {
      ...getVtexContext(ctx, sourceLocation),
      operation,
      operationType: 'API',
      ...data,
    })
  },

  /**
   * Log business operations  
   */
  logBusinessOperation(ctx: Context, operation: string, data?: any, sourceLocation?: { file?: string, function?: string }) {
    const { logger } = ctx
    logger?.info(`Business: ${operation}`, {
      ...getVtexContext(ctx, sourceLocation),
      operation,
      operationType: 'Business',
      businessData: data,
    })
  },

  /**
   * Log errors with full context
   */
  logError(ctx: Context, error: Error, operation?: string, data?: any, sourceLocation?: { file?: string, function?: string }) {
    const { logger } = ctx
    logger?.error(`Error: ${operation || error.name}`, {
      ...getVtexContext(ctx, sourceLocation),
      error: {
        message: error.message,
        name: error.name,
        stack: error.stack,
      },
      operation,
      operationType: 'Error',
      ...data,
    })
  },

  /**
   * Log debug information
   */
  logDebug(ctx: Context, message: string, data?: any, sourceLocation?: { file?: string, function?: string }) {
    const { logger } = ctx
    logger?.debug(message, {
      ...getVtexContext(ctx, sourceLocation),
      operationType: 'Debug',
      ...data,
    })
  },

  /**
   * Log warnings
   */
  logWarning(ctx: Context, message: string, data?: any, sourceLocation?: { file?: string, function?: string }) {
    const { logger } = ctx
    logger?.warn(message, {
      ...getVtexContext(ctx, sourceLocation),
      operationType: 'Warning',
      ...data,
    })
  },
}
