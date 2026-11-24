import { MasterData } from '@vtex/api'
import type {
  DocumentResponse,
  PaginationArgs,
  WithMetadata,
} from '@vtex/clients/build/clients/masterData/MasterDataEntity'

import type { ReturnRequest } from '../typings/returnRequest'
import { RETURN_REQUEST_SCHEMA_BODY } from '../masterdata/returnRequestSchema'

export const RETURN_REQUEST_ENTITY = 'vtex_return_app_returnRequest'

/**
 * Every version of the app reads and writes with this schema. It is pinned on
 * purpose: a schema named after each app version has to be revalidated and
 * indexed before searches return anything, which leaves lists empty after a
 * release. The 3.11.2 schema already exists and is indexed in the accounts.
 */
export const RETURN_REQUEST_SCHEMA = '3.11.2'

type Fields<K> = Array<ThisType<K> | '_all'>
type Document<K extends keyof WithMetadata<ReturnRequest>> = Pick<
  WithMetadata<ReturnRequest>,
  K
>

// One check per account and process. A failed check is retried on the next
// request.
const ensuredSchemas = new Map<string, Promise<void>>()

export const resetEnsuredSchemas = () => ensuredSchemas.clear()

interface SchemaBody {
  'v-security'?: { allowGetAll?: boolean; [key: string]: unknown }
  [key: string]: unknown
}

const statusOf = (error: unknown) =>
  (error as { response?: { status?: number } })?.response?.status

const isNotFound = (error: unknown) => statusOf(error) === 404

export class ReturnRequestClient extends MasterData {
  public async get<K extends keyof WithMetadata<ReturnRequest>>(
    id: string,
    fields: Fields<K>
  ): Promise<Document<K>> {
    return this.getDocument<Document<K>>({
      dataEntity: RETURN_REQUEST_ENTITY,
      id,
      fields: fields.map((field) => field.toString()),
    })
  }

  public async save(entity: ReturnRequest): Promise<DocumentResponse> {
    await this.ensureSchema()

    return this.createDocument({
      dataEntity: RETURN_REQUEST_ENTITY,
      fields: entity,
      schema: RETURN_REQUEST_SCHEMA,
    })
  }

  public async update(
    id: string,
    fields: Partial<ReturnRequest>
  ): Promise<void> {
    await this.ensureSchema()

    await this.updatePartialDocument({
      dataEntity: RETURN_REQUEST_ENTITY,
      id,
      fields,
      schema: RETURN_REQUEST_SCHEMA,
    })
  }

  // eslint-disable-next-line max-params
  public async search<K extends keyof WithMetadata<ReturnRequest>>(
    pagination: PaginationArgs,
    fields: Fields<K>,
    sort?: string,
    where?: string
  ): Promise<Array<Document<K>>> {
    await this.ensureSchema()

    return this.searchDocuments<Document<K>>({
      dataEntity: RETURN_REQUEST_ENTITY,
      pagination,
      fields: fields.map((field) => field.toString()),
      sort,
      where,
      schema: RETURN_REQUEST_SCHEMA,
    })
  }

  // eslint-disable-next-line max-params
  public async searchRaw<K extends keyof WithMetadata<ReturnRequest>>(
    pagination: PaginationArgs,
    fields: Fields<K>,
    sort?: string,
    where?: string
  ): Promise<{
    data: Array<Document<K>>
    pagination: { total: number; page: number; pageSize: number }
  }> {
    await this.ensureSchema()

    return this.searchDocumentsWithPaginationInfo<Document<K>>({
      dataEntity: RETURN_REQUEST_ENTITY,
      pagination,
      fields: fields.map((field) => field.toString()),
      sort,
      where,
      schema: RETURN_REQUEST_SCHEMA,
    })
  }

  /**
   * Makes sure the pinned schema is ready before a search or write:
   * - creates it when the account does not have it, for example a new
   *   install. A failure here fails the request and is retried next time;
   * - makes it private when it still allows get-all, keeping the rest of its
   *   body. Changing only v-security does not start a reindex. A failure here
   *   is logged and not retried by this process;
   * - when the check itself fails, the request goes on and the next request
   *   checks again.
   */
  private ensureSchema(): Promise<void> {
    const { account } = this.context
    let pending = ensuredSchemas.get(account)

    if (!pending) {
      pending = this.prepareSchema()
        .then((settled) => {
          if (!settled) ensuredSchemas.delete(account)
        })
        .catch((error) => {
          ensuredSchemas.delete(account)
          throw error
        })
      ensuredSchemas.set(account, pending)
    }

    return pending
  }

  /** Returns false when the schema could not be checked. */
  private async prepareSchema(): Promise<boolean> {
    let schema: SchemaBody | undefined

    try {
      schema = await this.getSchema<SchemaBody>({
        dataEntity: RETURN_REQUEST_ENTITY,
        schema: RETURN_REQUEST_SCHEMA,
      })
    } catch (error) {
      if (!isNotFound(error)) {
        this.context.logger.warn({
          message: 'Could not check the return request schema',
          schema: RETURN_REQUEST_SCHEMA,
          status: statusOf(error),
        })

        return false
      }
    }

    if (!schema) {
      this.context.logger.info({
        message: 'Creating the return request schema',
        schema: RETURN_REQUEST_SCHEMA,
      })

      await this.createOrUpdateSchema({
        dataEntity: RETURN_REQUEST_ENTITY,
        schemaName: RETURN_REQUEST_SCHEMA,
        schemaBody: RETURN_REQUEST_SCHEMA_BODY,
      })

      return true
    }

    if (schema['v-security']?.allowGetAll === true) {
      await this.makeSchemaPrivate(schema)
    }

    return true
  }

  private async makeSchemaPrivate(schema: SchemaBody): Promise<void> {
    try {
      await this.createOrUpdateSchema({
        dataEntity: RETURN_REQUEST_ENTITY,
        schemaName: RETURN_REQUEST_SCHEMA,
        schemaBody: {
          ...schema,
          'v-security': { ...schema['v-security'], allowGetAll: false },
        },
      })

      this.context.logger.info({
        message: 'Made the return request schema private',
        schema: RETURN_REQUEST_SCHEMA,
      })
    } catch (error) {
      this.context.logger.warn({
        message: 'Could not make the return request schema private',
        schema: RETURN_REQUEST_SCHEMA,
        status: statusOf(error),
      })
    }
  }
}
