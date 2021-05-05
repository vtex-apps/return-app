import {requestsStatuses} from "../../utils/utils";

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

        if(request.status === requestsStatuses.new) {
            nextPossibleStatuses = requestsStatuses.picked
        } else if (request.status === requestsStatuses.picked) {
            nextPossibleStatuses = requestsStatuses.pendingVerification
        } else if (request.status === requestsStatuses.pendingVerification) {
            nextPossibleStatuses = `${requestsStatuses.approved}, ${requestsStatuses.partiallyApproved}, ${requestsStatuses.denied}`
        } else if (request.status === requestsStatuses.approved || request.status === requestsStatuses.partiallyApproved) {
            nextPossibleStatuses = requestsStatuses.refunded
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
