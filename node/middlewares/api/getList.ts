import {formatComment, formatHistory, formatProduct, formatRequest} from "../../utils/utils";

export async function getList(ctx: Context, next: () => Promise<any>) {

    const {
        clients: {returnApp: returnAppClient}
    } = ctx

    const {page, limit, status, dateStart, dateEnd} = ctx.query;

    const filterData = {
        page: (page && !isNaN(page)) ? page : 1,
        limit: (limit && !isNaN(limit)) ? limit : 10,
        status: status ? status : "",
        dateStart: dateStart ? dateStart : "",
        dateEnd: dateEnd ? dateEnd : ""
    }

    const requestResponse = await returnAppClient.getList(ctx, 'returnRequests', 'request', filterData)
    let output: any[] = []

    if (requestResponse.length) {
        await Promise.all(requestResponse.map(async (request: any) => {
                const productsResponse = await returnAppClient.getDocuments(ctx, 'returnProducts', 'product', `refundId=${request.id}`)
                let products: any[] = []
                if (productsResponse.length) {
                    productsResponse.map((product: any) => {
                        products.push(formatProduct(product))
                    })
                }

                // Request status history
                const statusHistoryResponse = await returnAppClient.getDocuments(ctx, 'returnStatusHistory', 'statusHistory', `refundId=${request.id}`)
                let statusHistory: any[] = []
                if (statusHistoryResponse.length) {
                    statusHistoryResponse.map((history: any) => {
                        statusHistory.push(formatHistory(history))
                    })
                }

                // Request Comments
                const commentsResponse = await returnAppClient.getDocuments(ctx, 'returnComments', 'comment', `refundId=${request.id}`)
                let comments: any[] = []
                if (commentsResponse.length) {
                    commentsResponse.map((comment: any) => {
                        comments.push(formatComment(comment))
                    })
                }


                let currentRequest = {
                    ...formatRequest(request),
                    products,
                    statusHistory,
                    comments
                }

                output.push(currentRequest)
            })
        )
    }


    ctx.status = 200
    ctx.set('Cache-Control', 'no-cache')
    ctx.body = output.sort((a, b) => a.dateSubmitted < b.dateSubmitted ? 1 : -1)

    await next()
}
