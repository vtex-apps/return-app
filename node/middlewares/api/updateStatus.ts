/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import { json } from 'co-body'

import {
  getCurrentDate,
  productStatuses,
  requestsStatuses,
  getOneYearLaterDate,
  statusHistoryTimelines,
} from '../../utils/utils'

export async function updateStatus(ctx: Context, next: () => Promise<any>) {
  const { headers } = ctx.request
  const {
    clients: { returnApp: returnAppClient, masterData: masterDataClient },
  } = ctx

  const body = await json(ctx.req)

  let output = {
    success: true,
    errorMessage: '',
  }

  if (!body.submittedBy) {
    output = {
      ...output,
      success: false,
      errorMessage: '"submittedBy" field is missing',
    }
  }

  if (output.success) {
    const { request_id } = ctx.vtex.route.params
    const requestResponse = await masterDataClient.getDocuments(
      ctx,
      'returnRequests',
      'request',
      `id=${request_id}`
    )

    if (requestResponse.length) {
      const [request] = requestResponse
      const productsResponse = await masterDataClient.getDocuments(
        ctx,
        'returnProducts',
        'product',
        `refundId=${request_id}`
      )

      let nextStatus = ''

      if (request.status === requestsStatuses.new) {
        nextStatus = requestsStatuses.picked
      } else if (request.status === requestsStatuses.picked) {
        nextStatus = requestsStatuses.pendingVerification
      } else if (
        request.status === requestsStatuses.approved ||
        request.status === requestsStatuses.partiallyApproved
      ) {
        nextStatus = requestsStatuses.refunded
      } else if (request.status === requestsStatuses.refunded) {
        output = {
          ...output,
          success: false,
          errorMessage: `This request has been updated already refunded`,
        }
      } else if (request.status === requestsStatuses.denied) {
        output = {
          ...output,
          success: false,
          errorMessage: `This request has been denied`,
        }
      } else if (request.status === requestsStatuses.pendingVerification) {
        const extractStatuses = {
          [productStatuses.new]: 0,
          [productStatuses.pendingVerification]: 0,
          [productStatuses.partiallyApproved]: 0,
          [productStatuses.approved]: 0,
          [productStatuses.denied]: 0,
        }

        let totalProducts = 0

        productsResponse.forEach((currentProduct: any) => {
          extractStatuses[currentProduct.status] += 1
          totalProducts += 1
        })

        if (
          extractStatuses[productStatuses.new] > 0 ||
          extractStatuses[productStatuses.pendingVerification] > 0
        ) {
          output = {
            ...output,
            success: false,
            errorMessage: `You can't update this request. ${
              extractStatuses[productStatuses.pendingVerification]
            } products hasn't been verified yet. For more information use the check-status route`,
          }
        } else if (
          extractStatuses[productStatuses.approved] === totalProducts
        ) {
          nextStatus = requestsStatuses.approved
        } else if (extractStatuses[productStatuses.denied] === totalProducts) {
          nextStatus = requestsStatuses.denied
        } else if (
          (extractStatuses[productStatuses.approved] > 0 &&
            extractStatuses[productStatuses.approved] < totalProducts) ||
          extractStatuses[productStatuses.partiallyApproved] > 0
        ) {
          nextStatus = requestsStatuses.partiallyApproved
        }
      } else {
        output = {
          ...output,
          success: false,
          errorMessage: `Invalid status`,
        }
      }

      if (output.success && nextStatus) {
        // update request
        const newRequestBody = {
          ...request,
          status: nextStatus,
        }

        await masterDataClient.saveDocuments(
          ctx,
          'returnRequests',
          newRequestBody
        )

        // add history
        const historyBody = {
          refundId: request_id,
          status: nextStatus,
          submittedBy: body.submittedBy,
          dateSubmitted: getCurrentDate(),
          type: 'statusHistory',
        }

        await masterDataClient.saveDocuments(
          ctx,
          'returnStatusHistory',
          historyBody
        )

        if (nextStatus === requestsStatuses.pendingVerification) {
          // update all products to pendingVerification
          if (productsResponse.length) {
            productsResponse.map(async (product: any) => {
              const newProductBody = {
                ...product,
                status: nextStatus,
              }

              await masterDataClient.saveDocuments(
                ctx,
                'returnProducts',
                newProductBody
              )
            })
          }
        }

        if (
          nextStatus === requestsStatuses.refunded &&
          request.paymentMethod === 'giftCard'
        ) {
          const giftCardBody = {
            relationName: `RA${request_id.toString().split('-')[0]}`,
            caption: `RA${request_id.toString().split('-')[0]}`,
            expiringDate: getOneYearLaterDate(),
            balance: 0,
            profileId: newRequestBody.email,
            discount: true,
          }

          const response = await returnAppClient.createGiftCard(
            ctx,
            giftCardBody
          )

          const giftCardIdResponse = response.id
          const exploded = giftCardIdResponse.split('_')
          const giftCardId = exploded[exploded.length - 1]
          const updateGiftCardBody = {
            description: 'Initial Charge',
            value: newRequestBody.refundedAmount,
          }

          const updateGiftCardResponse =
            await returnAppClient.updateGiftCardApi(
              ctx,
              giftCardId,
              updateGiftCardBody,
              headers
            )

          const reqBody = {
            ...newRequestBody,
            giftCardCode: updateGiftCardResponse.redemptionCode,
            giftCardId,
          }

          await masterDataClient.saveDocuments(ctx, 'returnRequests', reqBody)
        }

        // Get all info and prepare for mail
        const commentsResponse = await masterDataClient.getDocuments(
          ctx,
          'returnComments',
          'comment',
          `refundId=${request_id}`
        )

        const newProductResponse = await masterDataClient.getDocuments(
          ctx,
          'returnProducts',
          'product',
          `refundId=${request_id}`
        )

        const timelineHistory = [
          {
            status: statusHistoryTimelines.new,
            step: 1,
            comments: commentsResponse.filter(
              (item: any) => item.status === requestsStatuses.new
            ),
            active: 1,
          },
          {
            status: statusHistoryTimelines.picked,

            step: 2,
            comments: commentsResponse.filter(
              (item: any) => item.status === requestsStatuses.picked
            ),
            active:
              newRequestBody.status === requestsStatuses.picked ||
              newRequestBody.status === requestsStatuses.pendingVerification ||
              newRequestBody.status === requestsStatuses.partiallyApproved ||
              newRequestBody.status === requestsStatuses.approved ||
              newRequestBody.status === requestsStatuses.denied ||
              newRequestBody.status === requestsStatuses.refunded
                ? 1
                : 0,
          },
          {
            status: statusHistoryTimelines.pending,
            step: 3,
            comments: commentsResponse.filter(
              (item: any) =>
                item.status === requestsStatuses.pendingVerification
            ),
            active:
              newRequestBody.status === requestsStatuses.pendingVerification ||
              newRequestBody.status === requestsStatuses.partiallyApproved ||
              newRequestBody.status === requestsStatuses.approved ||
              newRequestBody.status === requestsStatuses.denied ||
              newRequestBody.status === requestsStatuses.refunded
                ? 1
                : 0,
          },
          {
            status: statusHistoryTimelines.verified,
            step: 4,
            comments: commentsResponse.filter(
              (item: any) =>
                item.status === requestsStatuses.partiallyApproved ||
                item.status === requestsStatuses.approved ||
                item.status === requestsStatuses.denied
            ),
            active:
              newRequestBody.status === requestsStatuses.partiallyApproved ||
              newRequestBody.status === requestsStatuses.approved ||
              newRequestBody.status === requestsStatuses.denied ||
              newRequestBody.status === requestsStatuses.refunded
                ? 1
                : 0,
          },
          {
            status: statusHistoryTimelines.refunded,
            step: 5,
            comments: commentsResponse.filter(
              (item: any) => item.status === requestsStatuses.refunded
            ),
            active:
              newRequestBody.status === requestsStatuses.refunded ||
              newRequestBody.status === requestsStatuses.denied
                ? 1
                : 0,
          },
        ]

        const jsonDataMail = {
          data: { ...{ DocumentId: request_id }, ...newRequestBody },
          products: newProductResponse,
          timeline: timelineHistory,
        }

        // Get Data for Send Email
        const mailBody = {
          TemplateName: 'oms-return-request',
          applicationName: 'email',
          logEvidence: false,
          jsonData: jsonDataMail,
        }

        await returnAppClient.sendMail(ctx, mailBody)
      }
    } else {
      output = {
        ...output,
        success: false,
        errorMessage: 'Request not found',
      }
    }
  }

  ctx.status = 200
  ctx.set('Cache-Control', 'no-cache')
  ctx.body = output

  await next()
}
