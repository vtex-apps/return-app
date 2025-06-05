import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient, MasterData } from '@vtex/api'
import type {
  DocumentResponse,
  ScrollInput,
  WithMetadata,
} from '@vtex/clients/build/clients/masterData/MasterDataEntity'
import type { ReturnRequest } from 'odp.return-app'

const DATA_ENTITY_NAME = 'odp_return_app_returnRequest'
const SCHEMA_NAME = 'odp.returns'

interface PaginationArgs {
  page: number
  pageSize: number
}

export default class ReturnRequestClient extends JanusClient {
  public dataEntity: string
  public schema: string
  private inner: MasterData
  // private masterDataEntity: MasterDataEntity<ReturnRequest>

  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...options?.headers,
        VtexIdclientAutCookie: context.authToken,
        Accept: 'application/vnd.vtex.pricing.v3+json',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      },
    })

    this.schema = SCHEMA_NAME
    this.dataEntity = DATA_ENTITY_NAME

    this.inner = new MasterData(context, options)

    /* 
    const MasterDataEntityBuilder = masterDataFor<ReturnRequest>(
      'returnRequest',
      undefined,
      1
    )

    this.masterDataEntity = new MasterDataEntityBuilder(context)
    this.masterDataEntity.schema = SCHEMA_NAME 
    */
  }

  /*
  public async _get(id: string, fields: string[]): Promise<any> {
    return this.masterDataEntity.get(id, fields)
  }

  public async _search(
    pagination: { page: number; pageSize: number },
    fields: string[],
    sort?: string,
    where?: string
  ): Promise<any> {
    return this.masterDataEntity.search(pagination, fields, sort, where)
  }

  public async _searchRaw(
    pagination: { page: number; pageSize: number },
    fields: string[],
    sort?: string,
    where?: string
  ): Promise<any> {
    return this.masterDataEntity.searchRaw(pagination, fields, sort, where)
  }

  public async _save(entity: ReturnRequest): Promise<DocumentResponse> {
    return this.masterDataEntity.save(entity)
  }

  public async _update(id: string, entity: ReturnRequest): Promise<void> {
    return this.masterDataEntity.update(id, entity)
  }

  public async _delete(id: string): Promise<IOResponse<void>> {
    return this.masterDataEntity.delete(id)
  }

  public async _saveOrUpdate(entity: any): Promise<DocumentResponse> {
    return this.masterDataEntity.saveOrUpdate(entity)
  }

  public async _scroll(input: ScrollInput<ReturnRequest>): Promise<{
    data: Array<Pick<WithMetadata<ReturnRequest>, string | number>>
    mdToken: string
  }> {
    return this.masterDataEntity.scroll(input)
  }
  */

  public async save(entity: ReturnRequest): Promise<DocumentResponse> {
    return this.inner.createDocument({
      dataEntity: this.dataEntity,
      fields: entity,
      schema: this.schema,
    })
  }

  public async update(id: string, fields: Partial<ReturnRequest>) {
    return this.inner.updatePartialDocument({
      dataEntity: this.dataEntity,
      id,
      fields,
      schema: this.schema,
    })
  }

  public async saveOrUpdate(
    fields: ReturnRequest & { id: string }
  ): Promise<DocumentResponse> {
    return this.inner.createOrUpdateEntireDocument({
      dataEntity: this.dataEntity,
      fields,
      schema: this.schema,
    })
  }

  public async saveOrUpdatePartial(
    fields: ReturnRequest & { id: string }
  ): Promise<DocumentResponse> {
    return this.inner.createOrUpdatePartialDocument({
      dataEntity: this.dataEntity,
      fields,
      schema: this.schema,
    })
  }

  public async delete(id: string) {
    return this.inner.deleteDocument({ dataEntity: this.dataEntity, id })
  }

  // eslint-disable-next-line max-params
  public async search<K extends keyof WithMetadata<ReturnRequest>>(
    pagination: PaginationArgs,
    fields: Array<ThisType<K> | '_all'>,
    sort?: string,
    where?: string
  ): Promise<Array<Pick<WithMetadata<ReturnRequest>, K>>> {
    return this.inner.searchDocuments<Pick<WithMetadata<ReturnRequest>, K>>({
      dataEntity: this.dataEntity,
      pagination,
      fields: fields.map((field) => field.toString()),
      sort,
      where,
      schema: this.schema,
    })
  }

  // eslint-disable-next-line max-params
  public async searchRaw<K extends keyof WithMetadata<ReturnRequest>>(
    pagination: PaginationArgs,
    fields: Array<ThisType<K> | '_all'>,
    sort?: string,
    where?: string
  ): Promise<{
    data: Array<Pick<WithMetadata<ReturnRequest>, K>>
    pagination: { total: number; page: number; pageSize: number }
  }> {
    return this.inner.searchDocumentsWithPaginationInfo({
      dataEntity: this.dataEntity,
      pagination,
      fields: fields.map((field) => field.toString()),
      sort,
      where,
      schema: this.schema,
    })
  }

  public async get<K extends keyof WithMetadata<ReturnRequest>>(
    id: string,
    fields: Array<ThisType<K> | '_all'>
  ) {
    return this.inner.getDocument<Pick<WithMetadata<ReturnRequest>, K>>({
      dataEntity: this.dataEntity,
      id,
      fields: fields.map((field) => field.toString()),
    })
  }

  public async scroll<K extends keyof WithMetadata<ReturnRequest>>(
    input: ScrollInput<K>
  ) {
    const { mdToken, data } = await this.inner.scrollDocuments({
      ...input,
      dataEntity: this.dataEntity,
      fields: input.fields.map((field) => field.toString()),
      schema: this.schema,
    })

    /**
     * The scroll method on Master Data's client is mistyped (duplicating the object)
     */
    return {
      mdToken,
      data: data as unknown as Array<Pick<WithMetadata<ReturnRequest>, K>>,
    }
  }
}
