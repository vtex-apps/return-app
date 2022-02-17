import { isDeepStrictEqual } from 'util'

import { LINKED } from '@vtex/api'

import {
  COMMENTS_SCHEMA,
  HISTORY_SCHEMA,
  PRODUCTS_SCHEMA,
  RETURNS_SCHEMA,
  SETTINGS_SCHEMA,
} from '../../common/constants'

const appVersion = process.env.VTEX_APP_VERSION as string
const BUCKET_NAME = 'rma-schemaUpdated'

const isSchemaUpdated = async (ctx: Context) => {
  if (LINKED) return false
  const {
    clients: { vbase },
  } = ctx

  const wasUpdated = await vbase.getJSON<boolean | null>(
    BUCKET_NAME,
    appVersion,
    true
  )

  if (wasUpdated) return true

  return false
}

export const checkAndUpdateSchemas = async (ctx: Context) => {
  const {
    clients: { vbase, mdFactory },
    vtex: { logger },
  } = ctx

  let hasUpdated = false

  try {
    const updated = await isSchemaUpdated(ctx)

    // if updated === true, we don't need to update the schema
    if (updated) return

    // we update vbase no matter the result of hasChanged, so next call we skip the check
    await vbase.saveJSON(BUCKET_NAME, appVersion, 'true')

    // if hasChanged === false, we don't need to update the schema
    const settingsSchemaPromise = mdFactory.getSettingsSchema()
    const requestSchemaPromise = mdFactory.getRequestSchema()
    const commentsSchemaPromise = mdFactory.getCommentsSchema()
    const historySchemaPomise = mdFactory.getHistorySchema()
    const productsSchemaPromise = mdFactory.getProductsSchema()

    const [
      settingsSchema,
      requestSchema,
      commentsSchema,
      historySchema,
      productsSchema,
    ] = await Promise.all([
      settingsSchemaPromise,
      requestSchemaPromise,
      commentsSchemaPromise,
      historySchemaPomise,
      productsSchemaPromise,
    ])

    let updateSettingsSchemaPromise
    let updateRequestSchemaPromise
    let updateCommentsSchemaPromise
    let updateHistorySchemaPromise
    let updateProductsSchemaPromise

    if (!isDeepStrictEqual(settingsSchema, SETTINGS_SCHEMA)) {
      updateSettingsSchemaPromise =
        mdFactory.updateSettingsSchema(SETTINGS_SCHEMA)
      hasUpdated = true
    }

    if (!isDeepStrictEqual(requestSchema, RETURNS_SCHEMA)) {
      updateRequestSchemaPromise = mdFactory.updateRequestSchema(RETURNS_SCHEMA)
      hasUpdated = true
    }

    if (!isDeepStrictEqual(commentsSchema, COMMENTS_SCHEMA)) {
      updateCommentsSchemaPromise =
        mdFactory.updateCommentsSchema(COMMENTS_SCHEMA)
      hasUpdated = true
    }

    if (!isDeepStrictEqual(historySchema, HISTORY_SCHEMA)) {
      updateHistorySchemaPromise = mdFactory.updateHistorySchema(HISTORY_SCHEMA)
      hasUpdated = true
    }

    if (!isDeepStrictEqual(productsSchema, PRODUCTS_SCHEMA)) {
      updateProductsSchemaPromise =
        mdFactory.updatetProductsSchema(PRODUCTS_SCHEMA)
      hasUpdated = true
    }

    await Promise.all([
      updateSettingsSchemaPromise,
      updateRequestSchemaPromise,
      updateCommentsSchemaPromise,
      updateHistorySchemaPromise,
      updateProductsSchemaPromise,
    ])
  } catch (error) {
    if (error.response.status !== 304) {
      logger.error({
        message: `Error updating schema, appVersion: ${appVersion}`,
        error,
      })

      return
    }
  }

  if (hasUpdated) {
    logger.info({
      message: `Schemas updated, appVersion: ${appVersion}`,
    })
  } else {
    logger.info({
      message: `Schemas checked. Nothing to update, appVersion: ${appVersion}`,
    })
  }
}
