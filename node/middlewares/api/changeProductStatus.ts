import {json} from "co-body";
import {productStatuses, requestsStatuses} from "../../utils/utils";

export async function changeProductStatus(ctx: Context, next: () => Promise<any>) {

    const {
        clients: {returnApp: returnAppClient}
    } = ctx
    const body = await json(ctx.req)

    let output = {
        success: true,
        errorMessage: "",
        info: ""
    }

    if(!body.refId && !body.skuId) {
        output = {
            ...output,
            success: false,
            errorMessage: "skuId or refId must be provided"
        }
    }

    if(!body.goodQuantity) {
        output = {
            ...output,
            success: false,
            errorMessage: "goodQuantity field must be provided"
        }
    } else {
        if(isNaN(body.goodQuantity)) {
            output = {
                ...output,
                success: false,
                errorMessage: "goodQuantity field must be a number"
            }
        }
    }

    if(output.success) {
        const { request_id } = ctx.vtex.route.params
        const requestResponse = await returnAppClient.getDocuments(ctx, 'returnRequests', 'request', `id=${request_id}`)

        // verificam daca exista o cerere de retur cu id-ul respectiv
        if (requestResponse.length && requestResponse[0].status !== requestsStatuses.refunded) {
            const searchField = body.refId ? `skuId="${body.refId}"` : `sku="${body.skuId}"`
            const productResponse = await returnAppClient.getDocuments(ctx, 'returnProducts', 'product', `refundId=${request_id}__${searchField}`)

            // verificam daca exista produsul in cererea de retur
            if(productResponse.length) {
                const currentProduct = productResponse[0];
                const providedQuantity = parseInt(body.goodQuantity);

                // cantitatea introdusa este mai mare decat cantitatea din cerere
                if(providedQuantity > currentProduct.quantity) {
                    output = {
                        ...output,
                        success: false,
                        errorMessage: 'The quantity is higher than the one in the return request'
                    }
                } else {
                    // all good. update product status
                    let newStatus = '';
                    if(providedQuantity === 0) {
                        newStatus = productStatuses.denied
                    } else if (providedQuantity > 0 && providedQuantity < currentProduct.quantity) {
                        newStatus = productStatuses.partiallyApproved
                    } else if (providedQuantity === currentProduct.quantity) {
                        newStatus = productStatuses.approved
                    }

                    const newProductBody = {
                        ...currentProduct,
                        status: newStatus,
                        goodProducts: providedQuantity
                    }

                    // Update masterdata document
                    await returnAppClient.saveDocuments(ctx, 'returnProducts', newProductBody)
                }
            } else {
                output = {
                    ...output,
                    success: false,
                    errorMessage: 'Product not found'
                }
            }
        } else {
            output = {
                ...output,
                success: false,
                errorMessage: 'The request was not found or was refunded already'
            }
        }
    }

    ctx.status = 200
    ctx.set('Cache-Control', 'no-cache')
    ctx.body = output

    await next()
}
