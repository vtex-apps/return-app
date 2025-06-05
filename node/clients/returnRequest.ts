import type { InstanceOptions, IOContext, IOResponse } from '@vtex/api'
import { JanusClient } from '@vtex/api'
import { masterDataFor } from '@vtex/clients'
import type {
  DocumentResponse,
  MasterDataEntity,
  ScrollInput,
  WithMetadata,
} from '@vtex/clients/build/clients/masterData/MasterDataEntity'
import type { ReturnRequest } from 'odp.return-app'

export const DATA_ENTITY_NAME = 'odp_return_app_returnRequest'

export default class ReturnRequestClient extends JanusClient {
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
  }

  private getMasterDataClient = (): MasterDataEntity<ReturnRequest> => {
    const MasterDataBuilder = masterDataFor<ReturnRequest>(
      'returnRequest',
      undefined,
      1
    )

    const masterDataClient = new MasterDataBuilder(this.context)

    masterDataClient.schema = '3.10.0'

    return masterDataClient
  }

  private paginationArgsToHeaders({ page, pageSize }: any) {
    if (page < 1) {
      page = 1
    }

    const startIndex = (page - 1) * pageSize
    const endIndex = Number(startIndex) + Number(pageSize)

    return {
      'REST-Range': `resources=${startIndex}-${endIndex}`,
    }
  }

  public schema = ''
  public dataEntity = DATA_ENTITY_NAME

  public async get(id: string, fields: string[]): Promise<any> {
    const fieldsStr = fields?.join(',') ?? '_all'

    return this.http.get(
      `/api/dataentities/${DATA_ENTITY_NAME}/documents/${id}?_fields=${fieldsStr}`
    )
  }

  public async search(
    pagination: { page: number; pageSize: number },
    fields: string[],
    sort?: string,
    where?: string
  ): Promise<any> {
    const { page, pageSize } = pagination ?? {}
    const fieldsStr = fields?.join(',') ?? '_all'
    const sortStr = sort ?? ''
    const whereStr = where ?? ''

    return this.http.get(
      `/api/dataentities/${DATA_ENTITY_NAME}/search?_where=${whereStr}&_fields=${fieldsStr}&_sort=${sortStr}`,
      {
        headers: this.paginationArgsToHeaders({ page, pageSize }),
      }
    )
  }

  public async searchRaw(
    pagination: { page: number; pageSize: number },
    fields: string[],
    sort?: string,
    where?: string
  ): Promise<any> {
    const { page, pageSize } = pagination ?? {}
    const fieldsStr = fields.join(',')
    const sortStr = sort ?? ''
    const whereStr = where ?? ''

    const result = await this.http.getRaw(
      `/api/dataentities/${DATA_ENTITY_NAME}/search?_where=${whereStr}&_fields=${fieldsStr}&_sort=${sortStr}`,
      {
        headers: this.paginationArgsToHeaders({ page, pageSize }),
      }
    )

    const { headers } = result
    const restContentRange = headers['rest-content-range']
    const total = Number(restContentRange.split('/')[1])
    const paginationInfo = { ...pagination, total }

    return { data: result.data, pagination: paginationInfo }
  }

  public async save(entity: ReturnRequest): Promise<DocumentResponse> {
    return this.getMasterDataClient().save(entity)
  }

  public async update(id: string, entity: ReturnRequest): Promise<void> {
    return this.getMasterDataClient().update(id, entity)
  }

  public async delete(id: string): Promise<IOResponse<void>> {
    return this.getMasterDataClient().delete(id)
  }

  public async saveOrUpdate(entity: any): Promise<DocumentResponse> {
    return this.getMasterDataClient().saveOrUpdate(entity)
  }

  public async scroll(input: ScrollInput<ReturnRequest>): Promise<{
    data: Array<Pick<WithMetadata<ReturnRequest>, string | number>>
    mdToken: string
  }> {
    return this.getMasterDataClient().scroll(input)
  }
}
