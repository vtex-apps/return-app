import {ExternalClient, InstanceOptions, IOContext} from '@vtex/api'
import {dateFilter, currentDate} from "../utils/utils";


export default class ReturnApp extends ExternalClient {

    public schemas = {
        schemaEntity: "ReturnApp",
        settingsSchema: {
            'name': "returnSettings",
            'schema': {
                "properties": {
                    "maxDays": {"type": "integer"},
                    "excludedCategories": {"type": "string"},
                    "termsUrl": {"type": "string"},
                    "type": {"type": "string"}
                },
                "v-security": {
                    "allowGetAll": true,
                    "publicFilter": ["maxDays", "excludedCategories", "termsUrl", "type"],
                    "publicJsonSchema": false
                },
                "v-cache": false,
                "v-default-fields": ["id", "createdIn", "maxDays", "excludedCategories", "termsUrl", "type"],
                "v-indexed": ["id", "createdIn", "maxDays", "excludedCategories", "termsUrl", "type"]
            }
        },
        returnSchema: {
            'name': "returnRequests",
            'schema': {
                "properties": {
                    "userId": {"type": "string", "IsRelationship": true},
                    "orderId": {"type": "string", "IsRelationship": true},
                    "name": {"type": "string"},
                    "email": {"type": "string", "format": "email"},
                    "phoneNumber": {"type": "string", "maxLength": 50},
                    "country": {"type": "string", "maxLength": 50},
                    "locality": {"type": "string", "maxLength": 50},
                    "address": {"type": "string"},
                    "totalPrice": {"type": "integer"},
                    "paymentMethod": {"type": "string", "maxLength": 25},
                    "giftCardCode": {"type": "string"},
                    "giftCardId": {"type": "string"},
                    "refundedAmount": {"type": "integer"},
                    "iban": {"type": "string"},
                    "status": {"type": "string"},
                    "dateSubmitted": {"type": "string", "format": "date-time"},
                    "type": {"type": "string"}
                },
                "v-security": {
                    "allowGetAll": true,
                    "publicFilter": ["userId", "orderId", "name", "email", "phoneNumber", "country", "locality", "address", "totalPrice", "paymentMethod", "giftCardCode", "giftCardId", "refundedAmount", "iban", "status", "dateSubmitted", "type"],
                    "publicJsonSchema": false
                },
                "v-cache": false,
                "v-default-fields": ["id", "createdIn", "userId", "orderId", "name", "email", "phoneNumber", "country", "locality", "address", "totalPrice", "paymentMethod", "giftCardCode", "giftCardId", "refundedAmount", "iban", "status", "dateSubmitted", "type"],
                "v-indexed": ["id", "createdIn", "userId", "orderId", "name", "email", "phoneNumber", "country", "locality", "address", "totalPrice", "paymentMethod", "giftCardCode", "giftCardId", "refundedAmount", "iban", "status", "dateSubmitted", "type"]
            }
        },
        commentsSchema: {
            'name': "returnComments",
            'schema': {
                "properties": {
                    "refundId": {"type": "string", "IsRelationship": true},
                    "status": {"type": "string"},
                    "comment": {"type": "string"},
                    "visibleForCustomer": {"type": "boolean"},
                    "submittedBy": {"type": "string", "IsRelationship": true},
                    "dateSubmitted": {"type": "string", "format": "date-time"},
                    "type": {"type": "string"},
                },
                "v-security": {
                    "allowGetAll": true,
                    "publicFilter": ["refundId", "status", "comment", "visibleForCustomer", "submittedBy", "dateSubmitted", "type"],
                    "publicJsonSchema": false
                },
                "v-cache": false,
                "v-default-fields": ["id", "createdIn", "refundId", "status", "comment", "visibleForCustomer", "submittedBy", "dateSubmitted", "type"],
                "v-indexed": ["id", "createdIn", "refundId", "status", "comment", "visibleForCustomer", "submittedBy", "dateSubmitted", "type"]
            }
        },
        productsSchema: {
            'name': "returnProducts",
            'schema': {
                "properties": {
                    "refundId": {"type": "string"},
                    "orderId": {"type": "string"},
                    "userId": {"type": "string"},
                    "imageUrl": {"type": "string"},
                    "skuId": {"type": "string"},
                    "sku": {"type": "string"},
                    "productId": {"type": "string"},
                    "ean": {"type": "string"},
                    "brandId": {"type": "string"},
                    "brandName": {"type": "string"},
                    "skuName": {"type": "string"},
                    "manufacturerCode": {"type": "string"},
                    "unitPrice": {"type": "integer"},
                    "quantity": {"type": "integer"},
                    "totalPrice": {"type": "integer"},
                    "goodProducts": {"type": "integer"},
                    "reasonCode": {"type": "string"},
                    "reason": {"type": "string"},
                    "status": {"type": "string"},
                    "dateSubmitted": {"type": "string", "format": "date-time"},
                    "type": {"type": "string"}
                },
                "v-security": {
                    "allowGetAll": true,
                    "publicFilter": ["refundId", "orderId", "userId", "imageUrl", "skuId", "sku", "productId", "ean", "brandId", "brandName", "skuName", "manufacturerCode", "unitPrice", "quantity", "totalPrice", "goodProducts", "reasonCode", "reason", "status", "dateSubmitted", "type"],
                    "publicJsonSchema": false
                },
                "v-cache": false,
                "v-default-fields": ["id", "createdIn", "refundId", "orderId", "userId", "imageUrl", "sku", "skuId", "productId", "ean", "brandId", "brandName", "skuName", "manufacturerCode", "unitPrice", "quantity", "totalPrice", "goodProducts", "reasonCode", "reason", "status", "dateSubmitted", "type"],
                "v-indexed": ["id", "createdIn", "refundId", "orderId", "userId", "skuId", "sku", "productId", "ean", "brandId", "brandName", "skuName", "manufacturerCode", "status", "type"]
            }
        },
        statusHistorySchema: {
            'name': "returnStatusHistory",
            'schema': {
                "properties": {
                    "refundId": {"type": "string", "IsRelationship": true},
                    "status": {"type": "string"},
                    "submittedBy": {"type": "string", "IsRelationship": true},
                    "dateSubmitted": {"type": "string", "format": "date-time"},
                    "type": {"type": "string"},
                },
                "v-security": {
                    "allowGetAll": true,
                    "publicFilter": ["refundId", "status", "submittedBy", "dateSubmitted", "type"],
                    "publicJsonSchema": false
                },
                "v-cache": false,
                "v-default-fields": ["id", "createdIn", "refundId", "status", "submittedBy", "dateSubmitted", "type"],
                "v-indexed": ["id", "createdIn", "refundId", "status", "submittedBy", "dateSubmitted", "type"]
            }
        }
    }

    constructor(context: IOContext, options?: InstanceOptions) {
        super('', context, options)
    }

    public async getSchema(ctx: any): Promise<any> {
        return ctx.clients.masterdata.getSchema({
            dataEntity: this.schemas.schemaEntity,
            schema: this.schemas.settingsSchema.name
        })
    }

    public async generateSchema(ctx: any): Promise<any> {
        await ctx.clients.masterdata.createOrUpdateSchema({
            dataEntity: this.schemas.schemaEntity,
            schemaName: this.schemas.settingsSchema.name,
            schemaBody: this.schemas.settingsSchema.schema
        });
        await ctx.clients.masterdata.createOrUpdateSchema({
            dataEntity: this.schemas.schemaEntity,
            schemaName: this.schemas.returnSchema.name,
            schemaBody: this.schemas.returnSchema.schema
        });
        await ctx.clients.masterdata.createOrUpdateSchema({
            dataEntity: this.schemas.schemaEntity,
            schemaName: this.schemas.productsSchema.name,
            schemaBody: this.schemas.productsSchema.schema
        });
        await ctx.clients.masterdata.createOrUpdateSchema({
            dataEntity: this.schemas.schemaEntity,
            schemaName: this.schemas.commentsSchema.name,
            schemaBody: this.schemas.commentsSchema.schema
        });
        await ctx.clients.masterdata.createOrUpdateSchema({
            dataEntity: this.schemas.schemaEntity,
            schemaName: this.schemas.statusHistorySchema.name,
            schemaBody: this.schemas.statusHistorySchema.schema
        });
        return true;

    }


    public async getDocuments(ctx: any, schemaName: any, type: any, whereClause: any = ''): Promise<any> {
        let whereCls = '(type="' + type + '"';
        if (whereClause !== "1") {
            const where = whereClause.split('__');
            where.map((clause: any) => {
                whereCls += ' AND ' + clause
            })
        }
        whereCls += ')';

        return await ctx.clients.masterdata.searchDocuments({
            dataEntity: this.schemas.schemaEntity,
            fields: [],
            pagination: {
                page: 1,
                pageSize: 5000,
            },
            schema: schemaName,
            where: decodeURI(whereCls),
            sort: type !== "settings" ? "createdIn DESC" : ""
        })
    }

    public async saveDocuments(ctx: any, schemaName: any, body: any): Promise<any> {
        return await ctx.clients.masterdata.createOrUpdateEntireDocument({
            dataEntity: this.schemas.schemaEntity,
            fields: body,
            schema: schemaName,
            id: body.hasOwnProperty('id') ? body.id : ""
        })
    }

    public async savePartial(ctx: any, schemaName: any, body: any): Promise<any> {
        return await ctx.clients.masterdata.createOrUpdatePartialDocument({
            dataEntity: this.schemas.schemaEntity,
            fields: body,
            schema: schemaName,
            id: body.hasOwnProperty('id') ? body.id : ""
        })
    }

    public async getCategories(ctx: any): Promise<any> {
        return this.http.get(`http://${ctx.vtex.account}.vtexcommercestable.com.br/api/catalog_system/pub/category/tree/100`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Vtex-Use-Https': true
            }
        });
    }

    public async getSkuById(ctx: any, id: any): Promise<any> {
        return this.http.get(`http://${ctx.vtex.account}.vtexcommercestable.com.br/api/catalog/pvt/stockkeepingunit/` + id, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Vtex-Use-Https': true,
                'VtexIdclientAutCookie': ctx.vtex.authToken
            }
        });
    }

    public async getGiftCard(ctx: any, id: any): Promise<any> {
        return this.http.get(`http://${ctx.vtex.account}.vtexcommercestable.com.br/api/giftcards/` + id, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Vtex-Use-Https': true,
                'VtexIdclientAutCookie': ctx.vtex.authToken
            }
        });
    }

    public async getOrders(ctx: any, where: any): Promise<any> {
        return this.http.get(`http://${ctx.vtex.account}.vtexcommercestable.com.br/api/oms/pvt/orders?${where}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Vtex-Use-Https': true,
                'VtexIdclientAutCookie': ctx.vtex.authToken
            }
        });
    }

    public async getOrder(ctx: any, orderId: any): Promise<any> {
        return this.http.get(`http://${ctx.vtex.account}.vtexcommercestable.com.br/api/oms/pvt/orders/${orderId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Vtex-Use-Https': true,
                'VtexIdclientAutCookie': ctx.vtex.authToken
            }
        });
    }

    public async createGiftCard(ctx: any, body: Object): Promise<any> {
        return this.http.post(
            `http://${ctx.vtex.account}.vtexcommercestable.com.br/api/giftcards/`,
            body, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Vtex-Use-Https': true,
                    'VtexIdclientAutCookie': ctx.vtex.authToken
                }
            });
    }

    public async updateGiftCard(ctx: any, giftCardId: any, body: Object): Promise<any> {
        return this.http.post(
            `http://${ctx.vtex.account}.vtexcommercestable.com.br/api/gift-card-system/pvt/giftCards/${giftCardId}/credit`,
            body, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Vtex-Use-Https': true,
                    'VtexIdclientAutCookie': ctx.vtex.adminUserAuthToken
                }
            });
    }

    public async updateGiftCardApi(ctx: any, giftCardId: any, body: Object, headers: any): Promise<any> {
        return this.http.post(
            `http://${ctx.vtex.account}.vtexcommercestable.com.br/api/gift-card-system/pvt/giftCards/${giftCardId}/credit`,
            body, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Vtex-Use-Https': true,
                    'x-vtex-api-apptoken': headers['x-vtex-api-apptoken'],
                    'X-VTEX-API-AppKey': headers['x-vtex-api-appkey']
                }
            });
    }

    public async sendMail(ctx: any, body: Object): Promise<any> {
        return this.http.post(
            `http://${ctx.vtex.account}.vtexcommercestable.com.br/api/mail-service/pvt/sendmail`,
            body, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Vtex-Use-Https': true,
                    'VtexIdclientAutCookie': ctx.vtex.authToken
                }
            });
    }

    public async getList(ctx: any, schemaName: any, type: any, filterData: any): Promise<any> {
        let whereCls = '(type="' + type + '"';
        if (filterData.status) {
            whereCls += ' AND status=' + filterData.status
        }

        let startDate = "1970-01-01";
        let endDate = currentDate();
        if (filterData.dateStart !== "" || filterData.dateEnd !== "") {
            startDate =
                filterData.dateStart !== ""
                    ? dateFilter(filterData.dateStart)
                    : startDate;
            endDate =
                filterData.dateEnd !== ""
                    ? dateFilter(filterData.dateEnd)
                    : endDate;

            whereCls += "AND dateSubmitted between " + startDate + " AND " + endDate;
        }

        whereCls += ')';


        return await ctx.clients.masterdata.searchDocuments({
            dataEntity: this.schemas.schemaEntity,
            fields: [],
            pagination: {
                page: filterData.page,
                pageSize: filterData.limit,
            },
            schema: schemaName,
            where: decodeURI(whereCls),
            sort: "createdIn DESC"
        })
    }
}
