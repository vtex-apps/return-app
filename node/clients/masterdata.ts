import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

import {
  COMMENTS_SCHEMA,
  HISTORY_SCHEMA,
  PRODUCTS_SCHEMA,
  RETURNS_SCHEMA,
  SETTINGS_SCHEMA,
} from '../../common/constants'
import { currentDate, dateFilter } from '../utils/utils'

export default class Masterdata extends ExternalClient {
  public schemas = {
    schemaEntity: 'ReturnApp',
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

  constructor(context: IOContext, options?: InstanceOptions) {
    super('', context, {
      ...options,
      headers: {
        ...(options?.headers ?? {}),
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Vtex-Use-Https': 'true',
      },
    })
  }

  public async getSchema(ctx: any, schema: string): Promise<any> {
    return ctx.clients.masterdata.getSchema({
      dataEntity: this.schemas.schemaEntity,
      schema,
    })
  }

  public async generateSchema(ctx: any): Promise<any> {
    try {
      await ctx.clients.masterdata.createOrUpdateSchema({
        dataEntity: this.schemas.schemaEntity,
        schemaName: this.schemas.settingsSchema.name,
        schemaBody: this.schemas.settingsSchema.schema,
      })
    } catch (error) {
      console.error(error)
    }

    try {
      await ctx.clients.masterdata.createOrUpdateSchema({
        dataEntity: this.schemas.schemaEntity,
        schemaName: this.schemas.returnSchema.name,
        schemaBody: this.schemas.returnSchema.schema,
      })
    } catch (error) {
      console.error(error)
    }

    try {
      await ctx.clients.masterdata.createOrUpdateSchema({
        dataEntity: this.schemas.schemaEntity,
        schemaName: this.schemas.productsSchema.name,
        schemaBody: this.schemas.productsSchema.schema,
      })
    } catch (error) {
      console.error(error)
    }

    try {
      await ctx.clients.masterdata.createOrUpdateSchema({
        dataEntity: this.schemas.schemaEntity,
        schemaName: this.schemas.commentsSchema.name,
        schemaBody: this.schemas.commentsSchema.schema,
      })
    } catch (error) {
      console.error(error)
    }

    try {
      await ctx.clients.masterdata.createOrUpdateSchema({
        dataEntity: this.schemas.schemaEntity,
        schemaName: this.schemas.statusHistorySchema.name,
        schemaBody: this.schemas.statusHistorySchema.schema,
      })
    } catch (error) {
      console.error(error)
    }

    return true
  }

  // eslint-disable-next-line max-params
  public async getDocuments(
    ctx: any,
    schemaName: any,
    type: any,
    whereClause: any = ''
  ): Promise<any> {
    let whereCls = `(type="${type}"`

    if (whereClause !== '1') {
      whereClause.split('__').forEach((clause: any) => {
        whereCls += ` AND ${clause}`
      })
    }

    whereCls += ')'

    return ctx.clients.masterdata.searchDocuments({
      dataEntity: this.schemas.schemaEntity,
      fields: [],
      pagination: {
        page: 1,
        pageSize: 5000,
      },
      schema: schemaName,
      where: decodeURI(whereCls),
      sort: type !== 'settings' ? 'createdIn DESC' : '',
    })
  }

  public async saveDocuments(
    ctx: any,
    schemaName: any,
    body: any
  ): Promise<any> {
    return ctx.clients.masterdata.createOrUpdateEntireDocument({
      dataEntity: this.schemas.schemaEntity,
      fields: body,
      schema: schemaName,
      id: body.id ?? '',
    })
  }

  public async savePartial(ctx: any, schemaName: any, body: any): Promise<any> {
    let response
    try {
      response = ctx.clients.masterdata.createOrUpdatePartialDocument({
        dataEntity: this.schemas.schemaEntity,
        fields: body,
        schema: schemaName,
        id: body.id ?? '',
      })
    } catch (e) {
      console.log(e)
    }

    return response
  }

  // eslint-disable-next-line max-params
  public async getList(
    ctx: any,
    schemaName: any,
    type: any,
    filterData: any
  ): Promise<any> {
    let whereCls = `(type="${type}"`

    if (filterData.status) {
      whereCls += ` AND status=${filterData.status}`
    }

    let startDate = '1970-01-01'
    let endDate = currentDate()

    if (filterData.dateStart !== '' || filterData.dateEnd !== '') {
      startDate =
        filterData.dateStart !== ''
          ? dateFilter(filterData.dateStart)
          : startDate
      endDate =
        filterData.dateEnd !== '' ? dateFilter(filterData.dateEnd) : endDate

      whereCls += `AND dateSubmitted between ${startDate} AND ${endDate}`
    }

    whereCls += ')'

    return ctx.clients.masterdata.searchDocuments({
      dataEntity: this.schemas.schemaEntity,
      fields: [],
      pagination: {
        page: filterData.page,
        pageSize: filterData.limit,
      },
      schema: schemaName,
      where: decodeURI(whereCls),
      sort: 'createdIn DESC',
    })
  }
}
