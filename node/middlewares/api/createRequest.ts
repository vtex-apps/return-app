import {json} from "co-body";

import {getCurrentDate, requestsStatuses} from "../../utils/utils";

export async function createRequest(ctx: Context, next: () => Promise<any>) {
    const body = await json(ctx.req)
    const {
        clients: {returnApp: returnAppClient, masterData: masterDataClient}
    } = ctx;

    const {
        orderId,
        dateSubmitted,
        customerInfo,
        paymentInfo,
        products,
    } = body

    let success = true
    let message = ""
    let response

    await returnAppClient.getOrder(ctx, orderId)
        .then(async order => {

            await Promise.all(products.map(async (product: any) => {
                await returnAppClient.getSkuById(ctx, product.skuId)
                    .catch(() => {
                        success = false;
                        message = "Invalid SKU";
                    })
            }))

            if (success) {

                let productPrices = {} as any
                let totalPrice = 0

                await Promise.all(products.map(async (product: any) => {
                    const data = order.items.filter(function (item: any) {
                        return item.sellerSku === product.skuId
                    })

                    if (data.length) {
                        productPrices[product.skuId] = {
                            sellingPrice: data[0].sellingPrice,
                            quantity: parseInt(product.quantity),
                            imageUrl: data[0].imageUrl,
                            ean: data[0].ean,
                            brandName: data[0].additionalInfo.brandName,
                            brandId: data[0].additionalInfo.brandId
                        }
                        totalPrice = totalPrice + (data[0].sellingPrice * parseInt(product.quantity))
                    }
                }))

                let requestData = {
                    "userId": order.clientProfileData.userProfileId,
                    "orderId": orderId,
                    "name": customerInfo.name,
                    "email": customerInfo.email,
                    "phoneNumber": customerInfo.phoneNumber,
                    "country": customerInfo.country,
                    "locality": customerInfo.locality,
                    "address": customerInfo.address,
                    "paymentMethod": paymentInfo.paymentMethod,
                    "totalPrice": totalPrice,
                    "iban": paymentInfo.iban,
                    "status": requestsStatuses.new,
                    "dateSubmitted": dateSubmitted,
                    "type": "request"
                }

                await masterDataClient.saveDocuments(ctx, 'returnRequests', requestData)
                    .then(async requestResponse => {
                        products.map(async (product: any) => {
                            await returnAppClient.getSkuById(ctx, product.skuId)
                                .then(async (skuResponse: any) => {

                                    await masterDataClient.getDocuments(ctx, 'returnSettings', 'settings', '1')
                                        .then(async settings => {

                                            if (settings.length) {
                                                let options = settings[0].options
                                                let newReasonOption = true
                                                options.map((option: any) => {
                                                    if (product.reasonText === ""
                                                        || option.optionName.toLowerCase() === product.reasonText.toLowerCase()
                                                    ) {
                                                        newReasonOption = false
                                                    }
                                                })

                                                if (newReasonOption) {
                                                    settings[0].options.push({ optionName: product.reasonText, maxOptionDay: settings[0].maxDays })
                                                    await masterDataClient.saveDocuments(ctx, 'returnSettings', settings[0])
                                                }

                                                const productData = {
                                                    userId: order.clientProfileData.userProfileId,
                                                    orderId: orderId.toString(),
                                                    refundId: requestResponse.DocumentId,
                                                    skuId: product.refId.toString(),
                                                    productId: skuResponse.ProductId.toString(),
                                                    sku: product.skuId.toString(),
                                                    skuName: skuResponse.Name,
                                                    // manufacturerCode: "",
                                                    ean: productPrices[product.skuId].ean,
                                                    brandId: productPrices[product.skuId].brandId,
                                                    brandName: productPrices[product.skuId].brandName,
                                                    imageUrl: productPrices[product.skuId].imageUrl,
                                                    reasonCode: product.reasonCode,
                                                    reason: product.reasonText,
                                                    unitPrice: parseInt(productPrices[product.skuId].sellingPrice),
                                                    quantity: parseInt(product.quantity),
                                                    totalPrice: parseInt(
                                                        String(productPrices[product.skuId].sellingPrice * parseInt(product.quantity))
                                                    ),
                                                    goodProducts: 0,
                                                    status: requestsStatuses.new,
                                                    dateSubmitted: getCurrentDate(),
                                                    type: 'product'
                                                }

                                                await masterDataClient.saveDocuments(ctx, 'returnProducts', productData)
                                            }
                                        })
                                })
                        })

                        response = {
                            success: true,
                            data: {
                                request_id: requestResponse.DocumentId
                            },
                            errorMessage: ""
                        }
                    })
                    .catch(() => {
                        response = {
                            success: false,
                            data: {
                                request_id: null
                            },
                            errorMessage: "Could not create return request!"
                        }
                    })
            } else {
                response = {
                    success: success,
                    data: {
                        request_id: null
                    },
                    errorMessage: message
                }
            }
        })
        .catch(() => {
            response = {
                success: false,
                data: {
                    request_id: null
                },
                errorMessage: "Order not found!"
            }
        })

    ctx.status = 200
    ctx.set('Cache-Control', 'no-cache')
    ctx.body = response

    await next()
}
