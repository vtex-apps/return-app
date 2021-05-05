import {json} from "co-body";
import {getCurrentDate} from "../../utils/utils";

export async function addComment(ctx: Context, next: () => Promise<any>) {

    const {
        clients: {returnApp: returnAppClient}
    } = ctx
    const body = await json(ctx.req)

    let output = {
        success: true,
        errorMessage: ""
    }

    if(!body.submittedBy) {
        output = {
            ...output,
            success: false,
            errorMessage: '"submittedBy" field is missing'
        }
    }
    if(!body.comment) {
        output = {
            ...output,
            success: false,
            errorMessage: '"comment" field is missing'
        }
    }


    if(output.success) {
        const { request_id } = ctx.vtex.route.params
        const requestResponse = await returnAppClient.getDocuments(ctx, 'returnRequests', 'request', `id=${request_id}`)

        if (requestResponse.length) {
            const response = requestResponse[0];
            const commentBody = {
                type: 'comment',
                submittedBy: body.submittedBy,
                comment: body.comment,
                visibleForCustomer: !!body.visibleForCustomer,
                status: response.status,
                dateSubmitted: getCurrentDate(),
                refundId: request_id
            }
            await returnAppClient.saveDocuments(ctx, 'returnComments',  commentBody)
        } else {
            output = {
                ...output,
                success: false,
                errorMessage: 'Request not found'
            }
        }
    }



    ctx.status = 200
    ctx.set('Cache-Control', 'no-cache')
    ctx.body = output

    await next()
}
