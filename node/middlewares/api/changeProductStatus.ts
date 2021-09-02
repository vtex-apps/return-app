/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-restricted-globals */
/* eslint-disable camelcase */
import { json } from 'co-body'

import { productStatuses, requestsStatuses } from '../../utils/utils'

export async function changeProductStatus(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { masterData: masterDataClient },
  } = ctx

  const body = await json(ctx.req)

  let output = {
    success: true,
    errorMessage: '',
    info: '',
  }

  if (!body.refId && !body.skuId) {
    output = {
      ...output,
      success: false,
      errorMessage: 'skuId or refId must be provided',
    }
  }

  if (!body.goodQuantity) {
    output = {
      ...output,
      success: false,
      errorMessage: 'goodQuantity field must be provided',
    }
  } else if (isNaN(body.goodQuantity)) {
    output = {
      ...output,
      success: false,
      errorMessage: 'goodQuantity field must be a number',
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

    // verificam daca exista o cerere de retur cu id-ul respectiv
    if (requestResponse.length) {
      if (requestResponse[0].status === requestsStatuses.refunded) {
        output = {
          ...output,
          success: false,
          errorMessage: 'The request was refunded already',
        }
      } else if (
        requestResponse[0].status !== requestsStatuses.pendingVerification
      ) {
        output = {
          ...output,
          success: false,
          errorMessage: `The current request status is ${requestResponse[0].status}. You can change the product statuses only if the request is in ${requestsStatuses.pendingVerification}`,
        }
      } else {
        const searchField = body.refId
          ? `skuId="${body.refId}"`
          : `sku="${body.skuId}"`

        const productResponse = await masterDataClient.getDocuments(
          ctx,
          'returnProducts',
          'product',
          `refundId=${request_id}__${searchField}`
        )

        // verificam daca exista produsul in cererea de retur
        if (productResponse.length) {
          const [currentProduct] = productResponse
          const providedQuantity = parseInt(body.goodQuantity, 10)

          // cantitatea introdusa este mai mare decat cantitatea din cerere
          if (providedQuantity > currentProduct.quantity) {
            output = {
              ...output,
              success: false,
              errorMessage:
                'The quantity is higher than the one in the return request',
            }
          } else {
            // all good. update product status
            let newStatus = ''

            if (providedQuantity === 0) {
              newStatus = productStatuses.denied
            } else if (
              providedQuantity > 0 &&
              providedQuantity < currentProduct.quantity
            ) {
              newStatus = productStatuses.partiallyApproved
            } else if (providedQuantity === currentProduct.quantity) {
              newStatus = productStatuses.approved
            }

            const newProductBody = {
              ...currentProduct,
              status: newStatus,
              goodProducts: providedQuantity,
            }

            // Update masterdata document
            await masterDataClient.saveDocuments(
              ctx,
              'returnProducts',
              newProductBody
            )

            // get all products and calculate refundedAmount
            const requestProductsResponse = await masterDataClient.getDocuments(
              ctx,
              'returnProducts',
              'product',
              `refundId=${request_id}`
            )

            let refundedAmount = 0

            requestProductsResponse.forEach((currentProd: any) => {
              refundedAmount += currentProd.goodProducts * currentProd.unitPrice
            })

            // Update request
            const newRequestBody = {
              ...requestResponse[0],
              refundedAmount,
            }

            await masterDataClient.saveDocuments(
              ctx,
              'returnRequests',
              newRequestBody
            )
          }
        } else {
          output = {
            ...output,
            success: false,
            errorMessage: 'Product not found',
          }
        }
      }
    } else {
      output = {
        ...output,
        success: false,
        errorMessage: 'The request was not found',
      }
    }
  }

  ctx.status = 200
  ctx.set('Cache-Control', 'no-cache')
  ctx.body = output

  await next()
}
