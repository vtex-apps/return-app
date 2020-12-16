import {
    ExternalClient,
    InstanceOptions,
    IOContext,
    Apps
} from '@vtex/api'


export default class ReturnApp extends ExternalClient {

    public missing_tokens = 'Some settings are missing. Please check the Apps > Return App page'
    public apps = new Apps(this.context)
    public appId = process.env.VTEX_APP_ID as string

    public schemas = {
        schemaEntity: "ReturnApp",
        settingsSchema: {
            'name': "returnSettings",
            'schema': {
                'properties': {
                    'maxDays': {'type': "integer"},
                    'excludedCategories': {'type': "text"},
                    'termsUrl': {'type': "string"},
                    'type': {'type': "string"}
                },
                "v-security": {
                    'allowGetAll': true,
                    'publicRead': ['maxDays', 'excludedCategories', 'termsUrl', 'type'],
                    'publicWrite': ['maxDays', 'excludedCategories', 'termsUrl', 'type'],
                    'publicFilter': ['maxDays', 'excludedCategories', 'termsUrl', 'type'],
                    'publicJsonSchema': true
                },
                'v-cache': false,
                'v-default-fields': ['id', 'createdIn', 'maxDays', 'excludedCategories', 'termsUrl', 'type'],
                'indexed': ['id', 'createdIn', 'maxDays', 'excludedCategories', 'termsUrl', 'type'],
            }
        },
        returnSchema: {
            'name': "returnRequests",
            'schema': {
                'properties': {
                    'userId': {'type': "string", 'IsRelationship': true},
                    'orderId': {'type': "string", 'IsRelationship': true},
                    'name': {'type': "string"},
                    'email': {'type': "string", 'format': "email"},
                    'phoneNumber': {'type': "string", 'maxLength': 50},
                    'country': {'type': "string", 'maxLength': 50},
                    'locality': {'type': "string", 'maxLength': 50},
                    'address': {'type': "string"},
                    'totalPrice': {'type': "integer"},
                    'paymentMethod': {'type': "string", 'maxLength': 25},
                    'refundedAmount': {'type': "integer"},
                    'iban': {'type': "string"},
                    'status': {'type': "string"},
                    'dateSubmitted': {'type': "string", 'format': "date-time"},
                    'type': {'type': "string"}
                },
                "v-security": {
                    'allowGetAll': true,
                    'publicRead': ['userId', 'orderId', 'name', 'email', 'phoneNumber', 'country', 'locality', 'address', 'totalPrice', 'paymentMethod', 'refundedAmount', 'iban', 'status', 'dateSubmitted', 'type'],
                    'publicWrite': ['userId', 'orderId', 'name', 'email', 'phoneNumber', 'country', 'locality', 'address', 'totalPrice', 'paymentMethod', 'refundedAmount', 'iban', 'status', 'dateSubmitted', 'type'],
                    'publicFilter': ['userId', 'orderId', 'name', 'email', 'phoneNumber', 'country', 'locality', 'address', 'totalPrice', 'paymentMethod', 'refundedAmount', 'iban', 'status', 'dateSubmitted', 'type'],
                    'publicJsonSchema': true
                },
                'v-cache': false,
                'v-default-fields': ['id', 'createdIn', 'userId', 'orderId', 'name', 'email', 'phoneNumber', 'country', 'locality', 'address', 'totalPrice', 'paymentMethod', 'refundedAmount', 'iban', 'status', 'dateSubmitted', 'type'],
                'v-indexed': ['id', 'createdIn', 'userId', 'orderId', 'name', 'email', 'phoneNumber', 'country', 'locality', 'address', 'totalPrice', 'paymentMethod', 'refundedAmount', 'iban', 'status', 'dateSubmitted', 'type'],
            }
        },
        commentsSchema: {
            'name': "returnComments",
            'schema': {
                'properties': {
                    'refundId': {'type': "integer", 'IsRelationship': true},
                    'status': {'type': "string"},
                    'comment': {'type': "string"},
                    'visibleForCustomer': {'type': "boolean"},
                    'submittedBy': {'type': "string", 'IsRelationship': true},
                    'dateSubmitted': {'type': "string", 'format': "date-time"},
                    'type': {'type': "string"}
                },
                "v-security": {
                    'allowGetAll': true,
                    'publicRead': ['refundId', 'status', 'comment', 'visibleForCustomer', 'submittedBy', 'dateSubmitted', 'type'],
                    'publicWrite': ['refundId', 'status', 'comment', 'visibleForCustomer', 'submittedBy', 'dateSubmitted', 'type'],
                    'publicFilter': ['refundId', 'status', 'comment', 'visibleForCustomer', 'submittedBy', 'dateSubmitted', 'type'],
                    'publicJsonSchema': true
                },
                'v-cache': false,
                'v-default-fields': ['id', 'createdIn', 'refundId', 'status', 'comment', 'visibleForCustomer', 'submittedBy', 'dateSubmitted', 'type'],
                'v-indexed': ['id', 'createdIn', 'refundId', 'status', 'comment', 'visibleForCustomer', 'submittedBy', 'dateSubmitted', 'type'],
            }
        },
        productsSchema: {
            'name': "returnProducts",
            'schema': {
                'properties': {
                    'refundId': {'type': "string", 'IsRelationship': true},
                    'skuId': {'type': "string"},
                    'skuName': {'type': "string"},
                    'unitPrice': {'type': "integer"},
                    'quantity': {'type': "integer"},
                    'totalPrice': {'type': "integer"},
                    'goodProducts': {'type': "integer"},
                    'status': {'type': "string"},
                    'dateSubmitted': {'type': "string", 'format': "date-time"},
                    'type': {'type': "string"}
                },
                "v-security": {
                    'allowGetAll': true,
                    'publicRead': ['refundId', 'skuId', 'skuName', 'unitPrice', 'quantity', 'totalPrice', 'goodProducts', 'status', 'dateSubmitted', 'type'],
                    'publicWrite': ['refundId', 'skuId', 'skuName', 'unitPrice', 'quantity', 'totalPrice', 'goodProducts', 'status', 'dateSubmitted', 'type'],
                    'publicFilter': ['refundId', 'skuId', 'skuName', 'unitPrice', 'quantity', 'totalPrice', 'goodProducts', 'status', 'dateSubmitted', 'type'],
                    'publicJsonSchema': true
                },
                'v-cache': false,
                'v-default-fields': ['id', 'createdIn', 'refundId', 'skuId', 'skuName', 'unitPrice', 'quantity', 'totalPrice', 'goodProducts', 'status', 'dateSubmitted', 'type'],
                'v-indexed': ['id', 'createdIn', 'refundId', 'skuId', 'skuName', 'unitPrice', 'quantity', 'totalPrice', 'goodProducts', 'status', 'dateSubmitted', 'type'],
            }
        },
        statusHistorySchema: {
            'name': "returnStatusHistory",
            'schema': {
                'properties': {
                    'refundId': {'type': "integer", 'IsRelationship': true},
                    'status': {'type': "string"},
                    'submittedBy': {'type': "string", 'IsRelationship': true},
                    'dateSubmitted': {'type': "string", 'format': "date-time"},
                    'type': {'type': "string"}
                },
                "v-security": {
                    'allowGetAll': true,
                    'publicRead': ['refundId', 'status', 'submittedBy', 'dateSubmitted', 'type'],
                    'publicWrite': ['refundId', 'status', 'submittedBy', 'dateSubmitted', 'type'],
                    'publicFilter': ['refundId', 'status', 'submittedBy', 'dateSubmitted', 'type'],
                    'publicJsonSchema': true
                },
                'v-cache': false,
                'v-default-fields': ['id', 'createdIn', 'refundId', 'status', 'submittedBy', 'dateSubmitted', 'type'],
                'v-indexed': ['id', 'createdIn', 'refundId', 'status', 'submittedBy', 'dateSubmitted', 'type'],
            }
        }
    }

    constructor(context: IOContext, options?: InstanceOptions) {
        super('', context, options)
    }

    public async getSchema(schemaEntity: any, schemaName: any): Promise<any> {

        const settings = await this.apps.getAppSettings(this.appId)

        if (!settings.storeAppKey || !settings.storeAppToken || !settings.storeVendorName) {
            return JSON.stringify({error: this.missing_tokens})
        }

        return this.http.get(`http://${settings.storeVendorName}.vtexcommercestable.com.br/api/dataentities/${schemaEntity}/schemas/${schemaName}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Vtex-Use-Https': true,
                'X-VTEX-API-AppKey': settings.storeAppKey,
                'X-VTEX-API-AppToken': settings.storeAppToken
            }
        });


    }

    public async generateSchema(): Promise<any> {
        const settings = await this.apps.getAppSettings(this.appId)

        if (!settings.storeAppKey || !settings.storeAppToken || !settings.storeVendorName) {
            return JSON.stringify(this.missing_tokens)
        }

        const url = `http://${settings.storeVendorName}.vtexcommercestable.com.br/api/dataentities/${this.schemas.schemaEntity}/schemas/`;
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Vtex-Use-Https': true,
            'X-VTEX-API-AppKey': settings.storeAppKey,
            'X-VTEX-API-AppToken': settings.storeAppToken
        };

        await this.http.put(
            url + this.schemas.settingsSchema.name,
            JSON.stringify(this.schemas.settingsSchema.schema),
            {headers: headers}
        );
        await this.http.put(
            url + this.schemas.returnSchema.name,
            JSON.stringify(this.schemas.returnSchema.schema),
            {headers: headers});
        await this.http.put(
            url + this.schemas.productsSchema.name,
            JSON.stringify(this.schemas.productsSchema.schema),
            {headers: headers});
        await this.http.put(
            url + this.schemas.commentsSchema.name,
            JSON.stringify(this.schemas.commentsSchema.schema),
            {headers: headers});
        await this.http.put(
            url + this.schemas.statusHistorySchema.name,
            JSON.stringify(this.schemas.statusHistorySchema.schema),
            {headers: headers});
        return true;

    }


    public async getDocuments(schemaName: any, type: any, whereClause: any = ''): Promise<any> {
        const settings = await this.apps.getAppSettings(this.appId)
        if (!settings.storeAppKey || !settings.storeAppToken || !settings.storeVendorName) {
            return JSON.stringify({error: this.missing_tokens})
        }

        let baseURL = `http://${settings.storeVendorName}.vtexcommercestable.com.br/api/dataentities/${this.schemas.schemaEntity}/search?_schema=` + schemaName;

        baseURL += '&_where=(type="' + type + '"';

        if (whereClause !== "1") {
            const where = whereClause.split('__');
            where.map((clause:any) => {
                baseURL += ' AND ' + clause
            })

        }

        baseURL += ')';

        return this.http.get(baseURL, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Vtex-Use-Https': true,
                'X-VTEX-API-AppKey': settings.storeAppKey,
                'X-VTEX-API-AppToken': settings.storeAppToken
            }
        });

    }

    public async saveDocuments(schemaName: any, body: Object): Promise<any> {
        const settings = await this.apps.getAppSettings(this.appId)
        if (!settings.storeAppKey || !settings.storeAppToken || !settings.storeVendorName) {
            return JSON.stringify({error: this.missing_tokens})
        }

        return this.http.post(
            `http://${settings.storeVendorName}.vtexcommercestable.com.br/api/dataentities/${this.schemas.schemaEntity}/documents?_schema=` + schemaName,
            body, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Vtex-Use-Https': true,
                    'X-VTEX-API-AppKey': settings.storeAppKey,
                    'X-VTEX-API-AppToken': settings.storeAppToken
                }
            });
    }

    public async updateDocuments(documentId: any, body: Object): Promise<any> {
        const settings = await this.apps.getAppSettings(this.appId)
        if (!settings.storeAppKey || !settings.storeAppToken || !settings.storeVendorName) {
            return JSON.stringify({error: this.missing_tokens})
        }

        return this.http.put(
            `http://${settings.storeVendorName}.vtexcommercestable.com.br/api/dataentities/${this.schemas.schemaEntity}/documents/` + documentId,
            body, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Vtex-Use-Https': true,
                    'X-VTEX-API-AppKey': settings.storeAppKey,
                    'X-VTEX-API-AppToken': settings.storeAppToken
                }
            });
    }

    public async getCategories(): Promise<any> {
        const settings = await this.apps.getAppSettings(this.appId)
        if (!settings.storeAppKey || !settings.storeAppToken || !settings.storeVendorName) {
            return JSON.stringify({error: this.missing_tokens})
        }


        return this.http.get(`http://${settings.storeVendorName}.vtexcommercestable.com.br/api/catalog_system/pub/category/tree/100`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Vtex-Use-Https': true,
                'X-VTEX-API-AppKey': settings.storeAppKey,
                'X-VTEX-API-AppToken': settings.storeAppToken
            }
        });
    }

}
