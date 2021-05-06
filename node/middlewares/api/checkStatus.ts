import {productStatuses, requestsStatuses} from "../../utils/utils";

export async function checkStatus(ctx: Context, next: () => Promise<any>) {

    const {
        clients: {returnApp: returnAppClient}
    } = ctx
    const {request_id} = ctx.vtex.route.params


    const requestResponse = await returnAppClient.getDocuments(ctx, 'returnRequests', 'request', `id=${request_id}`)

    let output = {
        success: true,
        status: "",
        nextStatus: "",
        requiredSteps: {},
        errorMessage: ''
    }

    if (requestResponse.length) {
        const request = requestResponse[0];
        let nextPossibleStatuses = ''

        if (request.status === requestsStatuses.new) {
            nextPossibleStatuses = requestsStatuses.picked
        } else if (request.status === requestsStatuses.picked) {
            nextPossibleStatuses = requestsStatuses.pendingVerification
        } else if (request.status === requestsStatuses.pendingVerification) {
            nextPossibleStatuses = `${requestsStatuses.approved}, ${requestsStatuses.partiallyApproved}, ${requestsStatuses.denied}`
        } else if (request.status === requestsStatuses.approved || request.status === requestsStatuses.partiallyApproved) {
            nextPossibleStatuses = requestsStatuses.refunded
        }

        if (request.status === requestsStatuses.pendingVerification) {
            // verifica si adauga in requiredSteps
            let thisProductStep: any[] = []

            const productsResponse = await returnAppClient.getDocuments(ctx, 'returnProducts', 'product', `refundId=${request_id}`)
            if (productsResponse.length) {
                productsResponse.map((product: any) => {
                    if (product.status === productStatuses.pendingVerification) {
                        thisProductStep.push({
                            skuId: product.sku,
                            skuRefId: product.skuId,
                            name: product.skuName,
                            info: "Verification required",
                            status: product.status
                        })
                    }
                })
            }
            output = {
                ...output,
                requiredSteps: thisProductStep
            }
        }

        output = {
            ...output,
            status: request.status,
            nextStatus: nextPossibleStatuses
        }

    } else {
        output = {
            ...output,
            success: false,
            errorMessage: "Request not found"
        }
    }

    ctx.status = 200
    ctx.set('Cache-Control', 'no-cache')
    ctx.body = output

    await next()
}
