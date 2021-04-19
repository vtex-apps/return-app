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
                products.push({
                    image: product.imageUrl,
                    refId: product.skuId,
                    name: product.skuName,
                    unitPrice: product.unitPrice,
                    quantity: product.quantity,
                    totalPrice: product.totalPrice,
                    goodProducts: product.goodProducts,
                    reasonCode: product.reasonCode,
                    reasonText: product.reason,
                    status: product.status
                })
            })
        }

        // Request status history
        const statusHistoryResponse = await returnAppClient.getDocuments(ctx, 'returnStatusHistory', 'statusHistory', `refundId=${request_id}`)
        let statusHistory: any[] = []
        if (statusHistoryResponse.length) {
            statusHistoryResponse.map((history: any) => {
                statusHistory.push({
                    status: history.status,
                    dateSubmitted: history.dateSubmitted,
                    submittedBy: history.submittedBy
                })
            })
        }

        // Request status history
        const commentsResponse = await returnAppClient.getDocuments(ctx, 'returnComments', 'comment', `refundId=${request_id}`)
        let comments: any[] = []
        if (commentsResponse.length) {
            commentsResponse.map((comment: any) => {
                comments.push({
                    comment: comment.comment,
                    visibleForCustomer: comment.visibleForCustomer,
                    status: comment.status,
                    dateSubmitted: comment.dateSubmitted,
                    submittedBy: comment.submittedBy,

                })
            })
        }

        const requestOutput = {
            id: request.id,
            orderId: request.orderId,
            totalPrice: request.totalPrice,
            refundedAmount: request.refundedAmount,
            status: request.status,
            dateSubmitted: request.dateSubmitted,
            customerInfo: {
                name: request.name,
                email: request.email,
                phoneNumber: request.phoneNumber,
                country: request.country,
                locality: request.locality,
                address: request.address,
            },
            paymentInfo: {
                paymentMethod: request.paymentMethod,
                iban: request.iban,
                giftCardCode: request.giftCardCode,
                giftCardId: request.giftCardId,
            },
            products: products,
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
    ctx.body = output

    await next()
}
