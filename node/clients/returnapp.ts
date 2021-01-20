import {ExternalClient, InstanceOptions, IOContext} from '@vtex/api'


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
                    "publicRead": ["maxDays", "excludedCategories", "termsUrl", "type"],
                    "publicWrite": ["maxDays", "excludedCategories", "termsUrl", "type"],
                    "publicFilter": ["maxDays", "excludedCategories", "termsUrl", "type"],
                    "publicJsonSchema": true
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
                    "voucherCode": {"type": "string"},
                    "refundedAmount": {"type": "integer"},
                    "iban": {"type": "string"},
                    "status": {"type": "string"},
                    "dateSubmitted": {"type": "string", "format": "date-time"},
                    "type": {"type": "string"}
                },
                "v-security": {
                    "allowGetAll": true,
                    "publicRead": ["userId", "orderId", "name", "email", "phoneNumber", "country", "locality", "address", "totalPrice", "paymentMethod", "voucherCode", "refundedAmount", "iban", "status", "dateSubmitted", "type"],
                    "publicWrite": ["userId", "orderId", "name", "email", "phoneNumber", "country", "locality", "address", "totalPrice", "paymentMethod", "voucherCode", "refundedAmount", "iban", "status", "dateSubmitted", "type"],
                    "publicFilter": ["userId", "orderId", "name", "email", "phoneNumber", "country", "locality", "address", "totalPrice", "paymentMethod", "voucherCode", "refundedAmount", "iban", "status", "dateSubmitted", "type"],
                    "publicJsonSchema": true
                },
                "v-cache": false,
                "v-default-fields": ["id", "createdIn", "userId", "orderId", "name", "email", "phoneNumber", "country", "locality", "address", "totalPrice", "paymentMethod", "voucherCode", "refundedAmount", "iban", "status", "dateSubmitted", "type"],
                "v-indexed": ["id", "createdIn", "userId", "orderId", "name", "email", "phoneNumber", "country", "locality", "address", "totalPrice", "paymentMethod", "voucherCode", "refundedAmount", "iban", "status", "dateSubmitted", "type"]
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
                    "publicRead": ["refundId", "status", "comment", "visibleForCustomer", "submittedBy", "dateSubmitted", "type"],
                    "publicWrite": ["refundId", "status", "comment", "visibleForCustomer", "submittedBy", "dateSubmitted", "type"],
                    "publicFilter": ["refundId", "status", "comment", "visibleForCustomer", "submittedBy", "dateSubmitted", "type"],
                    "publicJsonSchema": true
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
                    "skuName": {"type": "string"},
                    "unitPrice": {"type": "integer"},
                    "quantity": {"type": "integer"},
                    "totalPrice": {"type": "integer"},
                    "goodProducts": {"type": "integer"},
                    "status": {"type": "string"},
                    "dateSubmitted": {"type": "string", "format": "date-time"},
                    "type": {"type": "string"}
                },
                "v-security": {
                    "allowGetAll": true,
                    "publicRead": ["refundId", "orderId", "userId", "imageUrl", "skuId", "skuName", "unitPrice", "quantity", "totalPrice", "goodProducts", "status", "dateSubmitted", "type"],
                    "publicWrite": ["refundId", "orderId", "userId", "imageUrl", "skuId", "skuName", "unitPrice", "quantity", "totalPrice", "goodProducts", "status", "dateSubmitted", "type"],
                    "publicFilter": ["refundId", "orderId", "userId", "imageUrl", "skuId", "skuName", "unitPrice", "quantity", "totalPrice", "goodProducts", "status", "dateSubmitted", "type"],
                    "publicJsonSchema": true
                },
                "v-cache": false,
                "v-default-fields": ["id", "createdIn", "refundId", "orderId", "userId", "imageUrl", "skuId", "skuName", "unitPrice", "quantity", "totalPrice", "goodProducts", "status", "dateSubmitted", "type"],
                "v-indexed": ["id", "createdIn", "refundId", "orderId", "userId", "skuId", "skuName", "status", "type"]
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
                    "publicRead": ["refundId", "status", "submittedBy", "dateSubmitted", "type"],
                    "publicWrite": ["refundId", "status", "submittedBy", "dateSubmitted", "type"],
                    "publicFilter": ["refundId", "status", "submittedBy", "dateSubmitted", "type"],
                    "publicJsonSchema": true
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
        await ctx.masterdata.createOrUpdateSchema({
            dataEntity: this.schemas.schemaEntity,
            schemaName: this.schemas.settingsSchema.name,
            schemaBody: this.schemas.settingsSchema.schema
        });
        await ctx.masterdata.createOrUpdateSchema({
            dataEntity: this.schemas.schemaEntity,
            schemaName: this.schemas.returnSchema.name,
            schemaBody: this.schemas.returnSchema.schema
        });
        await ctx.masterdata.createOrUpdateSchema({
            dataEntity: this.schemas.schemaEntity,
            schemaName: this.schemas.productsSchema.name,
            schemaBody: this.schemas.productsSchema.schema
        });
        await ctx.masterdata.createOrUpdateSchema({
            dataEntity: this.schemas.schemaEntity,
            schemaName: this.schemas.commentsSchema.name,
            schemaBody: this.schemas.commentsSchema.schema
        });
        await ctx.masterdata.createOrUpdateSchema({
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
                pageSize: 100,
            },
            schema: schemaName,
            where: whereCls,
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

    public async getCategories(ctx: any): Promise<any> {
        return this.http.get(`http://${ctx.vtex.account}.vtexcommercestable.com.br/api/catalog_system/pub/category/tree/100`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Vtex-Use-Https': true
            }
        });
    }

    public async createPromotion(ctx: any, body: Object): Promise<any> {
        return this.http.post(
            `http://${ctx.vtex.account}.vtexcommercestable.com.br/api/rnb/pvt/calculatorconfiguration`,
            body, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Vtex-Use-Https': true,
                    'VtexIdclientAutCookie': ctx.vtex.authToken
                }
            });
    }

    public async createCoupon(ctx: any, body: Object): Promise<any> {
        return this.http.post(
            `http://${ctx.vtex.account}.vtexcommercestable.com.br/api/rnb/pvt/coupon/`,
            body, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Vtex-Use-Https': true,
                    'VtexIdclientAutCookie': ctx.vtex.authToken
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
}
