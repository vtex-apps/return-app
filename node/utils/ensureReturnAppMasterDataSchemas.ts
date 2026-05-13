import returnRequestSchemaBody from '../../masterdata/returnRequest/schema.json'
import adjustmentNoteSchemaBody from '../../masterdata/adjustmentNote/schema.json'

interface SchemaAwareClient {
  getSchema: () => Promise<unknown>
  createOrUpdateSchema: (schemaBody: object) => Promise<unknown>
}

function isNotFoundError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false

  const e = error as {
    response?: { status?: number }
    status?: number
  }

  const fromResponse =
    e.response && typeof e.response.status === 'number'
      ? e.response.status
      : undefined
  const status =
    fromResponse !== undefined ? fromResponse : e.status

  return status === 404
}

function looksLikeMasterDataSchema(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false

  const o = value as Record<string, unknown>

  return 'properties' in o || 'required' in o
}

async function ensureEntitySchema(
  client: SchemaAwareClient,
  schemaBody: object
): Promise<void> {
  let shouldCreate = false

  try {
    const existing = await client.getSchema()

    if (!looksLikeMasterDataSchema(existing)) {
      shouldCreate = true
    }
  } catch (error) {
    if (isNotFoundError(error)) {
      shouldCreate = true
    } else {
      throw error
    }
  }

  if (shouldCreate) {
    await client.createOrUpdateSchema(schemaBody)
  }
}

/**
 * Ensures Master Data data entities and JSON schemas exist for return requests
 * and adjustment notes (same definitions as the `masterdata/` app builder).
 * Used when saving admin RMA settings so workspaces without a prior link still work.
 */
export async function ensureReturnAppMasterDataSchemas(ctx: Context): Promise<void> {
  const { returnRequestClient, adjustmentNoteClient } = ctx.clients

  await ensureEntitySchema(
    returnRequestClient,
    returnRequestSchemaBody as object
  )
  await ensureEntitySchema(
    adjustmentNoteClient,
    adjustmentNoteSchemaBody as object
  )
}
