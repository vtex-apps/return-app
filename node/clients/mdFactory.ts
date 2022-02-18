import { MasterData } from '@vtex/api'

import {
  COMMENTS_SCHEMA,
  HISTORY_SCHEMA,
  PRODUCTS_SCHEMA,
  RETURNS_SCHEMA,
  SETTINGS_SCHEMA,
} from '../../common/constants'
import type { createReturnProductFields } from '../utils/createReturnProductFields'
import type { createReturnRequestFields } from '../utils/createReturnRequestFields'
import type { createStatusHistoryFields } from '../utils/createStatusHistoryFields'

export class MDFactory extends MasterData {
  private dataEntity = 'ReturnApp'
  private schemas = {
    settingsSchema: {
      name: 'returnSettings',
      schema: SETTINGS_SCHEMA,
    },
    returnSchema: {
      name: 'returnRequests',
      schema: RETURNS_SCHEMA,
    },
    commentsSchema: {
      name: 'returnComments',
      schema: COMMENTS_SCHEMA,
    },
    productsSchema: {
      name: 'returnProducts',
      schema: PRODUCTS_SCHEMA,
    },
    statusHistorySchema: {
      name: 'returnStatusHistory',
      schema: HISTORY_SCHEMA,
    },
  }

  public deleteRMADocument(id: string) {
    return this.deleteDocument({ id, dataEntity: this.dataEntity })
  }

  public searchReturnRequests({
    fields,
    pagination,
    where,
  }: {
    fields?: string[]
    pagination?: {
      page: number
      pageSize: number
    }
    where?: string
  }) {
    return this.searchDocuments<ReturnRequest>({
      dataEntity: this.dataEntity,
      schema: this.schemas.returnSchema.name,
      fields: fields ?? ['id'],
      pagination: pagination ?? { page: 1, pageSize: 100 },
      ...(where ? { where } : {}),
    })
  }

  public createReturnRequest(
    returnRequestFields: ReturnType<typeof createReturnRequestFields>
  ) {
    return this.createDocument({
      dataEntity: this.dataEntity,
      schema: this.schemas.returnSchema.name,
      fields: returnRequestFields,
    })
  }

  public createStatusHistory(
    statusHistoryFields: ReturnType<typeof createStatusHistoryFields>
  ) {
    return this.createDocument({
      dataEntity: this.dataEntity,
      schema: this.schemas.statusHistorySchema.name,
      fields: statusHistoryFields,
    })
  }

  public createReturnProduct(
    productReturnFields: ReturnType<typeof createReturnProductFields>
  ) {
    return this.createDocument({
      dataEntity: this.dataEntity,
      schema: this.schemas.productsSchema.name,
      fields: productReturnFields,
    })
  }
}
