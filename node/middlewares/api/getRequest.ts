import {formatComment, formatHistory, formatProduct, formatRequest} from "../../utils/utils";

export async function getRequest(ctx: Context, next: () => Promise<any>) {

    const {
        clients: {returnApp: returnAppClient}
    } = ctx
    const {request_id} = ctx.vtex.route.params


    const requestResponse = await returnAppClient.getDocuments(ctx, 'returnRequests', 'request', `id=${request_id}`)

    let output = {
        success: false,
        message: 'Not Found',
        data: {}
    }

    if (requestResponse.length) {
        const request = requestResponse[0];
        // Request Products
        const productsResponse = await returnAppClient.getDocuments(ctx, 'returnProducts', 'product', `refundId=${request_id}`)
        let products: any[] = []
        if (productsResponse.length) {
            productsResponse.map((product: any) => {
                products.push(formatProduct(product))
            })
        }

        // Request status history
        const statusHistoryResponse = await returnAppClient.getDocuments(ctx, 'returnStatusHistory', 'statusHistory', `refundId=${request_id}`)
        let statusHistory: any[] = []
        if (statusHistoryResponse.length) {
            statusHistoryResponse.map((history: any) => {
                statusHistory.push(formatHistory(history))
            })
        }

        // Request Comments
        const commentsResponse = await returnAppClient.getDocuments(ctx, 'returnComments', 'comment', `refundId=${request_id}`)
        let comments: any[] = []
        if (commentsResponse.length) {
            commentsResponse.map((comment: any) => {
                comments.push(formatComment(comment))
            })
        }


        const requestOutput = {
            ...formatRequest(request),
            products,
            statusHistory,
            comments
        }
        output = {
            ...output,
            success: true,
            message: '',
            data: requestOutput
        }
    }

    ctx.status = 200
    ctx.set('Cache-Control', 'no-cache')
    ctx.body = output

    await next()
}
